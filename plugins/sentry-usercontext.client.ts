/*
Automatically set and clear the Sentry usercontext based on auth status.
*/
import { AuthState } from "@okta/okta-auth-js";

export default defineNuxtPlugin((nuxtApp) => {
  // When auth state changes, update sentry user context
  function _handleAuthStateUpdate(newAuthState: AuthState | null) {
    if (newAuthState && newAuthState.isAuthenticated) {
      const rawIdToken = nuxtApp.$okta.getIdToken();
      const idToken = rawIdToken ? nuxtApp.$okta.token.decode(rawIdToken) : null;
      nuxtApp.$sentry.setUser({
        id: idToken?.payload.sub,
        email: idToken?.payload.email,
      });
    } else {
      nuxtApp.$sentry.setUser(null);
    }
  }

  // Populate Sentry user
  _handleAuthStateUpdate(nuxtApp.$okta.authStateManager.getAuthState());

  // Subscribe to auth state changes
  nuxtApp.$okta.authStateManager.subscribe(_handleAuthStateUpdate);
});
