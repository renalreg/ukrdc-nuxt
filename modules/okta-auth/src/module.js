import { defu } from "defu";
import { join, resolve } from "path";

const moduleDefaults = {
  namespace: "oktaAuth",
  defaultProtectRoutes: false,
};

const oktaAuthModule = function () {
  // Merge options with defaults
  const options = defu(this.options.okta, moduleDefaults);

  // Add the plugin
  this.addPlugin({
    src: resolve(__dirname, "plugin.client.js"),
    fileName: join(options.namespace, "okta-auth.client.js"),
    mode: "client",
    options,
  });
};

export default oktaAuthModule;
