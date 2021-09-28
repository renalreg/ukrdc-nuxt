import RuntimeConfigurableOauth2Scheme from './runtimeConfigurableScheme'

// Functions aren't exported by the Auth module, so we need to
// re-define them here to be used in our overrides

function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
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
  // We may, at some point, need to override mounted() and _handleCallback, or the
  // request interceptor to fix this issue, once we know the actual conditions that
  // trigger it.
}
