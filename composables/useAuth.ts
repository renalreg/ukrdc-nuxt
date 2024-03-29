/*
Utility functions to simplify interacting with a reactive Okta Auth state.
*/

import { computed, onBeforeUnmount, ref, useContext } from "@nuxtjs/composition-api";
import { AuthState, JWTObject, JWTPayload } from "@okta/okta-auth-js";

export declare type UKRDCClaims = JWTPayload & {
  "org.ukrdc.permissions": string[];
};

export interface UKRDCJWTObject extends JWTObject {
  payload: UKRDCClaims;
}

export default function () {
  const { $okta } = useContext();
  const authState = ref<AuthState | null>($okta.authStateManager.getAuthState());

  // When auth state changes, update authState.value
  function _handleAuthStateUpdate(newAuthState: AuthState) {
    authState.value = Object.assign(authState.value || {}, newAuthState);
  }

  // Subscribe to auth state changes
  $okta.authStateManager.subscribe(_handleAuthStateUpdate);

  // Unsubscribe from auth state changes when component is destroyed
  onBeforeUnmount(() => {
    $okta.authStateManager.unsubscribe(_handleAuthStateUpdate);
  });

  // Reactive decoded ID token
  const idToken = computed((): JWTObject | null => {
    if (authState.value?.idToken?.idToken) {
      return $okta.token.decode(authState.value?.idToken?.idToken);
    }
    return null;
  });

  // Reactive decoded access token
  const accessToken = computed(() => {
    if (authState.value?.accessToken?.accessToken) {
      return $okta.token.decode(authState.value?.accessToken?.accessToken);
    }
    return null;
  });

  // Reactive isAuthenticated
  const isAuthenticated = computed(() => {
    return authState.value?.isAuthenticated || false;
  });

  return {
    authState,
    idToken,
    accessToken,
    isAuthenticated,
  };
}
