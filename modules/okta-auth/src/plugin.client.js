/*
Injects an $okta object into the Vue instance and context,
allowing components to interact with a shared OktaAuth instance.
*/

import { OktaAuth } from "@okta/okta-auth-js";
import { defu } from "defu";
import urljoin from "url-join";

class NuxtOktaAuth extends OktaAuth {
  constructor(options, router) {
    super(options);
    this.router = router;

    // Look for a router instance to handle URI restoration
    if (!this.options.restoreOriginalUri) {
      // eslint-disable-next-line require-await
      this.options.restoreOriginalUri = async (_oktaAuth, originalUri) => {
        // If a router is available, provide a default implementation
        if (this.router && originalUri) {
          // Our originalUri will always be a router path (i.e. route.value.fullPath),
          // so we can pass it straight through to the router without any further modifications.
          this.router.replace({ path: originalUri });
        }
      };
    }
  }

  signInAuto(originalUri) {
    // Set the originalUri to be restored after sign-in, then sign in with redirect
    if (this.router) {
      this.setOriginalUri(originalUri || this.router.currentRoute.fullPath);
      return this.signInWithRedirect();
    }
  }

  signOutAuto() {
    return this.signOut({
      postLogoutRedirectUri: `${window.location.origin}${this.options.postLogoutRedirectUri}`,
    });
  }

  signedIn() {}
}

function routeOption(route, key, value) {
  // A route can (technically) be associated with multiple Components,
  // so we pass a value we're looking for in each component's options
  // and return true if any of them have the value.
  return route.matched.some((m) => {
    return Object.values(m.components).some((component) => component.options && component.options[key] === value);
  });
}

const oktaPlugin = (_ctx, inject) => {
  // Common variables
  const router = _ctx.app.router;
  const basePath = router?.options.base || "/";

  // Get build-time options from module
  const options = JSON.parse(`<%= JSON.stringify(options) %>`);

  // Fetch (runtime) config from context
  const runtimeOptions = _ctx.$config.okta;

  // Combine build-time and runtime options
  const configOptions = defu(options, runtimeOptions);

  // Assert router base is prepended to callback URLs
  if (configOptions.postLogoutRedirectUri) {
    configOptions.postLogoutRedirectUri = urljoin(basePath, configOptions.postLogoutRedirectUri);
  }
  if (configOptions.redirectUri) {
    configOptions.redirectUri = urljoin(basePath, configOptions.redirectUri);
  }

  // Create OktaAuth instance
  const oktaAuth = new NuxtOktaAuth(configOptions, router);

  // Handle auth guard
  // NOTE: We use router.beforeEach instead of Nuxt router middleware.
  // This is because the router middleware has no proper way to cancel
  // navigation, so the page always ends up being loaded before the sign-in
  // redirect has been handled, leading to unauthenticated API requests.
  // Here however, we can return anything other than next() to cancel or
  // postpone navigation. So if the user is not authenticated, we return
  // the signInAuto promise, which blocks navigation until
  // the sign-in redirect has been handled.
  router.beforeEach(async (to, _from, next) => {
    // Check if the route being navigated to requires authentication
    let routeIsProtected;
    if (configOptions.defaultProtectRoutes) {
      // Protect route unless explicitly set to false
      routeIsProtected = !routeOption(to, "auth", false);
    } else {
      // Protect route only if explicitly set to true
      routeIsProtected = routeOption(to, "auth", true);
    }

    if (routeIsProtected) {
      // Check if the user is authenticated
      const isAuthenticated = await oktaAuth.isAuthenticated();
      if (!isAuthenticated) {
        // If not, set the originalUri to the destination, and redirect to the sign-in page
        return oktaAuth.signInAuto(to.fullPath);
      }
    }
    next();
  });

  // Handle onAuthExpired
  if (configOptions.authExpiredRedirectUri) {
    oktaAuth.authStateManager.subscribe((authState) => {
      if (!authState.isAuthenticated) {
        // Store the current route
        oktaAuth.setOriginalUri(router.currentRoute.fullPath);
        // Redirect to the authExpiredRedirectUri
        _ctx.redirect(configOptions.authExpiredRedirectUri);
      }
    });
  }

  // Start the auth background service
  oktaAuth.start();

  // Inject oktaAuth into Vue
  inject("okta", oktaAuth);
};

export default oktaPlugin;
