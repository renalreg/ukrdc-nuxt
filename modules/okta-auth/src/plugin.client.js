/*
Injects an $okta object into the Vue instance and context,
allowing components to interact with a shared OktaAuth instance.
*/

import { OktaAuth } from "@okta/okta-auth-js";

const oktaPlugin = (_ctx, inject) => {
  // Common variables
  const router = _ctx.app.router;
  const basePath = router?.options.base || "/";

  // Get build-time options from module
  const options = JSON.parse(`<%= JSON.stringify(options) %>`);

  // Fetch (runtime) config from context
  const runtimeOptions = _ctx.$config.okta;

  // Combine build-time and runtime options
  const configOptions = {
    ...options,
    ...runtimeOptions,
  };

  // Assert router base is prepended to callback URLs
  if (configOptions.postLogoutRedirectUri) {
    configOptions.postLogoutRedirectUri = basePath + configOptions.postLogoutRedirectUri;
  }
  if (configOptions.redirectUri) {
    configOptions.redirectUri = basePath + configOptions.redirectUri;
  }

  // Create OktaAuth instance
  const oktaAuth = new OktaAuth(configOptions);

  // Start the auth background service
  oktaAuth.start();

  // Look for a router instance to handle URI restoration
  if (!oktaAuth.options.restoreOriginalUri) {
    // eslint-disable-next-line require-await
    oktaAuth.options.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      // If a router is available, provide a default implementation
      if (router && originalUri) {
        // Our originalUri will always be a router path (i.e. route.value.fullPath, see useAuth.ts),
        // so we can pass it straight through to the router without any further modifications.
        router.replace({ path: originalUri });
      }
    };
  }

  // Inject oktaAuth into Vue
  inject("okta", oktaAuth);
};

export default oktaPlugin;
