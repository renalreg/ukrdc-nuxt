/*
Utility functions to simplify interacting with the Okta Auth SDK.
Automatically starts the auth background service when created, and
stops it when the component is destroyed. Since old components are
always destroyed before new components are created, we can be sure
that the background service will be running when we need it.
*/

import { onBeforeUnmount, ref, useContext, useRoute } from '@nuxtjs/composition-api'

import { OktaAuth, AuthState } from '@okta/okta-auth-js'

export default function () {
  const { $okta, $config } = useContext()
  const route = useRoute()

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
    oktaAuth.signInWithRedirect({ originalUri: route.value.fullPath })
  }

  function isLoginRedirect() {
    return oktaAuth.isLoginRedirect()
  }

  async function handleLoginRedirect() {
    await oktaAuth.handleLoginRedirect()
  }

  function signIn() {
    if (!signedIn()) {
      signInWithRedirect()
    }
  }

  async function signOut() {
    await oktaAuth.signOut({
      postLogoutRedirectUri: `${window.location.origin}${$config.okta.redirectUri}`,
    })
  }

  function signedIn(): boolean {
    return (authState.value && authState.value.isAuthenticated) || false
  }

  function getAccessToken() {
    if (signedIn()) {
      const rawAccessToken = oktaAuth.getAccessToken()
      return rawAccessToken ? oktaAuth.token.decode(rawAccessToken) : null
    } else {
      return undefined
    }
  }

  function getIdToken() {
    if (signedIn()) {
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

  // NB: Auth-guard/Routing middleware
  // In a normal Vue app we would likely have a vue-router middleware that
  // checks if the user is signed in before allowing them to access the route.
  // However in Nuxt, router middleware gets executed server-side, and we don't
  // know the auth state at that stage. Instead, we call signIn() within the setup
  // of pages that require auth. We cannot apply this to the default template, as
  // that is rendered on the server-side, with the page content then loaded client-side.

  return {
    // Auth states
    oktaAuth,
    authState,
    signedIn,
    // Token and user info
    getAccessToken,
    getIdToken,
    getUser,
    // Sign in functionality
    signInWithRedirect,
    isLoginRedirect,
    handleLoginRedirect,
    signIn,
    // Sign out functionality
    signOut,
  }
}
