import RuntimeConfigurableOauth2Scheme from './runtimeConfigurableScheme'

// Functions aren't exported by the Auth module, so we need to
// re-define them here to be used in our overrides

function parseQuery(queryString) {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}
function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}
function normalizePath(path = '', ctx) {
  let result = path.split('?')[0]
  if (ctx && ctx.base) {
    result = result.replace(ctx.base, '/')
  }
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1)
  }
  result = result.replace(/\/+/g, '/')
  return result
}

export default class RuntimeConfigurableOktaScheme extends RuntimeConfigurableOauth2Scheme {
  // In principle we should be able to use nuxt-auth's $auth.logout function,
  // however Okta requires an ID token when using the logout API, which nuxt-auth
  // doesn't store.
  // Instead we redirect to the user management logout page, which in turn redirects
  // to our apps logout page, which resets the auth state.
  logout() {
    // this.reset()
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
  async mounted() {
    const { tokenExpired, refreshTokenExpired } = this.check(true)
    if (refreshTokenExpired || (tokenExpired && this.options.autoLogout)) {
      this.$auth.reset()
    }
    this.requestHandler.initializeRequestInterceptor(this.options.endpoints.token)
    const redirected = await this._handleCallback()
    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  async _handleCallback() {
    // Handle the callback from Okta sign-in page, parsing the URL query
    // to get our code we then exchange for a token
    if (
      this.$auth.options.redirect &&
      normalizePath(this.$auth.ctx.route.path, this.$auth.ctx) !==
        normalizePath(this.$auth.options.redirect.callback, this.$auth.ctx)
    ) {
      return
    }
    if (process.server) {
      return
    }
    // Get data from the URL query
    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1))
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)
    // Check if token and refresh token are included in the query
    let token = parsedQuery[this.options.token.property]
    let refreshToken
    if (this.options.refreshToken.property) {
      refreshToken = parsedQuery[this.options.refreshToken.property]
    }
    // Set universal auth state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }
    // If we're using an auth_code flow, and a code is present
    if (this.options.responseType === 'code' && parsedQuery.code) {
      // If we're not using the implicit challenge mode, store the code verifier
      let codeVerifier
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
          code: parsedQuery.code,
          client_id: this.options.clientId + '',
          redirect_uri: this.redirectURI,
          response_type: this.options.responseType,
          audience: this.options.audience,
          grant_type: this.options.grantType,
          code_verifier: codeVerifier,
        }),
        // Override the headers to make absolutely sure we're not passing an Authorization header
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: '' },
      })
      // Save the tokens
      token = getProp(response.data, this.options.token.property) || token
      refreshToken = getProp(response.data, this.options.refreshToken.property) || refreshToken
    }
    // Return early if no token was returned
    if (!token || !token.length) {
      return
    }
    // Store the tokens
    this.token.set(token)
    if (refreshToken && refreshToken.length) {
      this.refreshToken.set(refreshToken)
    }
    // Redirect to home (or the page the user was on before the login flow started)
    this.$auth.redirect('home', true)
    return true
  }
}
