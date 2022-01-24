/*
Automatically set and clear the Sentry usercontext based on auth status.
*/
import { Context } from '@nuxt/types'
import { AuthState } from '@okta/okta-auth-js'

export default function ({ $okta, $sentry }: Context) {
  // When auth state changes, update sentry user context
  function _handleAuthStateUpdate(newAuthState: AuthState | null) {
    if (newAuthState && newAuthState.isAuthenticated) {
      const rawIdToken = $okta.getIdToken()
      const idToken = rawIdToken ? $okta.token.decode(rawIdToken) : null
      $sentry.setUser({
        id: idToken?.payload.sub,
        email: idToken?.payload.email,
      })
    } else {
      $sentry.setUser(null)
    }
  }

  // Populate Sentry user
  _handleAuthStateUpdate($okta.authStateManager.getAuthState())

  // Subscribe to auth state changes
  $okta.authStateManager.subscribe(_handleAuthStateUpdate)
}
