import RuntimeConfigurableOauth2Scheme from './runtimeConfigurableScheme'

function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}

export default class RuntimeConfigurableOktaScheme extends RuntimeConfigurableOauth2Scheme {
  // In principle we should be able to use nuxt-auth's $auth.logout function,
  // however Okta requires an ID token when using the logout API, which nuxt-auth
  // doesn't store. Instead we reset the auth state locally and redirect to
  // the user management logout page
  logout() {
    if (this.options.endpoints.logout) {
      const opts = {
        client_id: this.options.clientId,
        fromURI: this.logoutRedirectURI,
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
      window.location.replace(url)
    }
    return this.$auth.reset()
  }
}
