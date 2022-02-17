export default {
  // Disable SSR, and build as an SPA
  ssr: false,
  // Use the Nuxt server to serve the SPA, allowing runtime config
  target: "server",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "UKRDC Web Client",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content: "",
      },
    ],
  },

  server: {
    host: process.env.HOST || "localhost",
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/vuex-persistedstate.client.ts",
    "~/plugins/v-calendar.client.ts",
    "~/plugins/v-tooltip.client.ts",
    "~/plugins/toast.client.ts",
    "~/plugins/vue-clickaway.client.ts",
    "~/plugins/axios-ukrdc-api.client.ts",
    "~/plugins/axios-error-handlers.ts",
    "~/plugins/sentry-usercontext.client.ts",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/composition-api/module",
    "@nuxt/postcss8", // Required for TailwindCSS
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["~/modules/okta-auth", "@nuxtjs/axios", "@nuxtjs/sentry"],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  // Router and middleware configuration
  router: {
    middleware: ["check-ie"],
    base: process.env.APP_BASE_URL || "/new/app",
  },

  // Build-time variables. These are resolved during the build process,
  // and can be accessed via `process.env.VAR_NAME` in the code.
  env: {
    githubRef: process.env.GITHUB_REF || "Not Available",
    githubSha: process.env.GITHUB_SHA || "Not Available",
  },

  // Sentry Configuration: https://sentry.nuxtjs.org/guide/setup
  sentry: {
    dsn: process.env.SENTRY_DSN,
    // Skip publish if no Sentry auth token is found at build-time
    publishRelease: process.env.SENTRY_AUTH_TOKEN
      ? {
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          // Attach commits to the release (requires that the build triggered within a git repository).
          setCommits: {
            auto: true,
          },
        }
      : false,
    sourceMapStyle: "hidden-source-map",
    tracing: {
      tracesSampleRate: 1.0,
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: ["mount", "update"],
          timeout: 2000,
          trackComponents: true,
        },
      },
      browserOptions: {},
    },
  },

  // Okta JS config
  okta: {
    defaultProtectRoutes: true,
    redirectUri: "/login",
    postLogoutRedirectUri: "/login",
    authExpiredRedirectUri: "/login",
    responseType: "code",
    pkce: true,
    scopes: ["openid", "profile", "email", "offline_access"],
  },

  // Runtime configuration variables
  publicRuntimeConfig: {
    // Custom UKRDC API config
    api: {
      host: process.env.API_HOST,
      base: process.env.API_BASE_URL || "/new/api",
    },
    // Okta domain
    manageAccountUrl: process.env.MANAGE_ACCOUNT_URL || "https://renalregistry.okta.com/app/UserHome",
    // Deployment environment
    deploymentEnv: process.env.DEPLOYMENT_ENV || "development",
    // Sentry public runtime config, see https://sentry.nuxtjs.org/sentry/runtime-config/
    sentry: {
      config: {
        environment: process.env.DEPLOYMENT_ENV || "development",
      },
    },
    // Okta JS runtime config
    okta: {
      issuer: process.env.OAUTH_ISSUER,
      clientId: process.env.APP_CLIENT_ID,
    },
  },
};
