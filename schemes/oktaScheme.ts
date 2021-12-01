import type { AxiosResponse } from 'axios'
import RuntimeConfigurableOauth2Scheme from './runtimeConfigurableScheme'
import { parseQuery, encodeQuery, normalizePath, getProp } from './utils'

export default class RuntimeConfigurableOktaScheme extends RuntimeConfigurableOauth2Scheme {
  // In principle we should be able to use nuxt-auth's $auth.logout function,
  // however Okta requires an ID token when using the logout API, which nuxt-auth
  // doesn't store.
  // Instead we redirect to the user management logout page, which in turn redirects
  // to our apps logout page, which resets the auth state.
  logout() {
    this.$auth.reset()
    if (this.options.endpoints.logout) {
      const opts = {
        client_id: this.options.clientId,
        fromURI: this.logoutRedirectURI,
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
      window.location.replace(url)
    }
  }

  // We have another issue to deal with: When using the PKCE flow with Okta,
  // requests to the token endpoint need to contain ETHER client information in
  // the request body, when not using a client secret (as we do), OR client ID
  // and secret in an authorization header.
  // Once you're authenticated, the auth module helpfully adds the access token
  // as a default authorization header for Axios requests, excluding the header
  // when a request is being made to the token endpoint.
  // However, this doesn't seem to work perfectly, and sometimes the auth header
  // gets sent to the token enpoint too, and throws a 401.
  // We need to override mounted() and _handleCallback to fix this issue, by
  // overriding the request headers
  async mounted(): Promise<AxiosResponse | void> {
    const { tokenExpired, refreshTokenExpired } = this.check(true)

    // Force reset if refresh token has expired
    // Or if `autoLogout` is enabled and token has expired
    if (refreshTokenExpired || (tokenExpired && this.options.autoLogout)) {
      this.$auth.reset()
    }

    // Initialize request interceptor
    this.requestHandler.initializeRequestInterceptor(this.options.endpoints.token)

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  async _handleCallback() {
    // Handle callback only for specified route
    if (
      this.$auth.options.redirect &&
      normalizePath(this.$auth.ctx.route.path, this.$auth.ctx) !==
        normalizePath(this.$auth.options.redirect.callback, this.$auth.ctx)
    ) {
      return
    }
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    // Get data from the URL query
    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1))
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)
    // Check if token and refresh token are included in the query
    let token: string = parsedQuery[this.options.token.property] as string
    let refreshToken: string | undefined
    if (this.options.refreshToken.property) {
      refreshToken = parsedQuery[this.options.refreshToken.property] as string
    }

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // If we're using an auth_code flow, and a code is present
    if (this.options.responseType === 'code' && parsedQuery.code) {
      // If we're not using the implicit challenge mode, store the code verifier
      let codeVerifier
      // Retrieve code verifier and remove it from storage
      if (this.options.codeChallengeMethod && this.options.codeChallengeMethod !== 'implicit') {
        codeVerifier = this.$auth.$storage.getUniversal(this.name + '.pkce_code_verifier')
        this.$auth.$storage.setUniversal(this.name + '.pkce_code_verifier', null)
      }

      // Exchange the code and verifier for tokens
      const response = await this.$auth.request({
        method: 'post',
        url: this.options.endpoints.token,
        baseURL: '',
        data: encodeQuery({
          code: parsedQuery.code as string,
          client_id: this.options.clientId + '',
          redirect_uri: this.redirectURI,
          response_type: this.options.responseType,
          audience: this.options.audience,
          grant_type: this.options.grantType,
          code_verifier: codeVerifier as string,
        }),
        // Override the headers to make absolutely sure we're not passing an Authorization header
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: '' },
      })

      // Save the tokens
      token = (getProp(response.data, this.options.token.property) as string) || token
      refreshToken = (getProp(response.data, this.options.refreshToken.property) as string) || refreshToken
    }

    // Return early if no token was returned
    if (!token || !token.length) {
      return
    }

    // Set token
    this.token.set(token)
    // Store refresh token
    if (refreshToken && refreshToken.length) {
      this.refreshToken.set(refreshToken)
    }
    // Redirect to home (or the page the user was on before the login flow started)
    this.$auth.redirect('home', true)
    return true
  }
}
