import { resolve, join } from "path";

const oktaAuthModule = function () {
  // Merge options with defaults
  const options = {
    namespace: "oktaAuth",
    redirectUri: "/login",
    postLogoutRedirectUri: "/login",
    responseType: "code",
    pkce: true,
    scopes: [],
    ...this.options.okta,
  };

  // Add the plugin
  this.addPlugin({
    src: resolve(__dirname, "plugin.client.js"),
    fileName: join(options.namespace, "okta-auth.client.js"),
    mode: "client",
    options,
  });
};

export default oktaAuthModule;
