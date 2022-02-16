import { Context } from "@nuxt/types";
import { AuthState } from "@okta/okta-auth-js";

export default function ({ $okta, route, redirect }: Context) {
  // Watch the auth state for asynchronous changes from the auth background service.
  // If the user is completely signed out (all tokens expired), auto-redirect to the
  // login page.
  // TODO: This may, if it works properly, eliminate entirely the need for our auth
  // router middleware. The middleware catches cases where the auth has expired in
  // between page navigations, but that's irrelevant with this plugin enabled, since
  // the auth expiry and redirect happens immediately as soon as it's relevant.
  // However, the middleware still catches the case of a user entering a page directly,
  // e.g. from a bookmark, so this whole paragraph might be a waste of time...
  $okta.authStateManager.subscribe((authState: AuthState) => {
    if (!authState.isAuthenticated) {
      $okta.setOriginalUri(route.fullPath);
      redirect("/login");
    }
  });
}
