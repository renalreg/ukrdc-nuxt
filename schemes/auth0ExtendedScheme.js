/*
This custom auth scheme serves the single purpose of adding Auth0 scopes
into the nuxt-auth `user` object.

nuxt-auth retrieves user info from the auth0 /userinfo API route, which
does not include scopes or permissions. We need to read user scopes/permissions
to determine which UI elements to render.

The Auth0 token itself does include scopes however. Here, we override the 
fetchUser() method to first call Auth0Scheme.fetchUser(), then decode the
current Auth0 token, extract scopes, and insert them into the `user` object.

This may not be required in future, especially if nuxt-auth starts supporting
id_token (which DOES include scopes) with the PKCE grant flow.

See:
https://github.com/nuxt-community/auth-module/issues/1114
https://github.com/nuxt-community/auth-module/issues/970
*/

import jwtDecode from 'jwt-decode'
import { Auth0Scheme } from '~auth/runtime'

function scopesToArray(scopes) {
  return scopes.split(' ')
}

function tokenToScopes(token) {
  return scopesToArray(jwtDecode(token.get().split(' ')[1]).scope)
}

export default class CustomScheme extends Auth0Scheme {
  async fetchUser() {
    await super.fetchUser()
    const customUser = {
      ...this.$auth.user,
      scope: tokenToScopes(this.$auth.strategy.token),
    }
    this.$auth.setUser(customUser)
  }
}
