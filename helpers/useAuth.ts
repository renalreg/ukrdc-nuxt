/*
Utility functions to simplify interacting with the Okta Auth SDK.
*/

import { onBeforeUnmount, ref, useContext } from '@nuxtjs/composition-api'

import { OktaAuth, AuthState, UserClaims, JWTObject } from '@okta/okta-auth-js'

export interface UKRDCClaims {
  'org.ukrdc.permissions': string[]
}

export interface UKRDCJWTObject extends JWTObject {
  payload: UserClaims<UKRDCClaims>
}

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

  async function signOut() {
    await oktaAuth.signOut({
      postLogoutRedirectUri: `${window.location.origin}${$config.okta.postLogoutRedirectUri}`,
    })
  }

  function signedIn(): boolean {
    return (authState.value && authState.value.isAuthenticated) || false
  }

  function getAccessToken(): UKRDCJWTObject | null {
    if (signedIn()) {
      const rawAccessToken = oktaAuth.getAccessToken()
      return rawAccessToken ? (oktaAuth.token.decode(rawAccessToken) as UKRDCJWTObject) : null
    } else {
      return null
    }
  }

  function getIdToken(): JWTObject | null {
    if (signedIn()) {
      const rawIdToken = oktaAuth.getIdToken()
      return rawIdToken ? oktaAuth.token.decode(rawIdToken) : null
    } else {
      return null
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
    signedIn,
    // Token and user info
    getAccessToken,
    getIdToken,
    getUser,
    // Sign out functionality
    signOut,
  }
}
