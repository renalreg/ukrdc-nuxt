/*
Utility functions to simplify interacting with the Okta Auth SDK.
Automatically starts the auth background service when created, and
stops it when the component is destroyed. Since old components are
always destroyed before new components are created, we can be sure
that the background service will be running when we need it.
*/

import { computed, onBeforeUnmount, ref, useContext } from '@nuxtjs/composition-api'

import { OktaAuth, AuthState } from '@okta/okta-auth-js'

export default function () {
  const { $okta, $config } = useContext()

  const oktaAuth: OktaAuth = $okta
  const authState = ref($okta.authStateManager.getAuthState())

  // HANDLE STATE CHANGES

  // When auth state changes, update authState.value
  function _handleAuthStateUpdate(newAuthState: AuthState) {
    authState.value = Object.assign(authState.value || {}, newAuthState)
  }

  // Subscribe to auth state changes
  oktaAuth.authStateManager.subscribe(_handleAuthStateUpdate)

  // Unsubscribe from auth state changes when component is destroyed
  onBeforeUnmount(() => {
    oktaAuth.authStateManager.unsubscribe(_handleAuthStateUpdate)
  })

  function signInWithRedirect() {
    // TODO: Get originalUri from router
    oktaAuth.signInWithRedirect({ originalUri: '/login' })
  }

  function isLoginRedirect() {
    return oktaAuth.isLoginRedirect()
  }

  async function handleLoginRedirect() {
    await oktaAuth.handleLoginRedirect()
  }

  async function signOut() {
    // TODO: Get postLogoutRedirectUri from router
    await oktaAuth.signOut({
      postLogoutRedirectUri: `${window.location.origin}${$config.okta.redirectUri}`,
    })
  }

  function loggedIn(): boolean {
    return (authState.value && authState.value.isAuthenticated) || false
  }

  const isLoggedIn = computed(() => loggedIn())

  function getAccessToken() {
    if (loggedIn()) {
      const rawAccessToken = oktaAuth.getAccessToken()
      return rawAccessToken ? oktaAuth.token.decode(rawAccessToken) : null
    } else {
      return undefined
    }
  }

  function getIdToken() {
    if (loggedIn()) {
      const rawIdToken = oktaAuth.getIdToken()
      return rawIdToken ? oktaAuth.token.decode(rawIdToken) : null
    } else {
      return undefined
    }
  }

  async function getUser(): Promise<{ [key: string]: any }> {
    // Get user info from the /userinfo Okta API endpoint
    return await oktaAuth.getUser()
  }

  return {
    // Auth states
    oktaAuth,
    authState,
    isLoggedIn,
    loggedIn,
    // Token and user info
    getAccessToken,
    getIdToken,
    getUser,
    // Sign in functionality
    signInWithRedirect,
    isLoginRedirect,
    handleLoginRedirect,
    // Sign out functionality
    signOut,
  }
}
