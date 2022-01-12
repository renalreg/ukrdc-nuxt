export default {
  // Disable SSR, and build as an SPA
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ukrdc-nuxt',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
  },

  server: {
    host: process.env.HOST || 'localhost',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.ts',
    '~/plugins/vuex-persistedstate.client.ts',
    '~/plugins/v-calendar.client.ts',
    '~/plugins/v-tooltip.client.ts',
    '~/plugins/toast.client.ts',
    '~/plugins/vue-clickaway.client.ts',
    '~/plugins/okta-auth.client.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api/module', '@nuxtjs/tailwindcss'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/sentry'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [],
  },

  // Sentry Configuration: https://sentry.nuxtjs.org/guide/setup
  sentry: {
    dsn: process.env.SENTRY_DSN,
    // Skip publish if no DSN is found at build-time
    publishRelease: process.env.SENTRY_DSN
      ? {
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          // Attach commits to the release (requires that the build triggered within a git repository).
          setCommits: {
            auto: true,
          },
          deploy: {
            // The release's environment name.
            env: process.env.DEPLOYEMNT_ENV || 'development',
          },
        }
      : false,
    sourceMapStyle: 'hidden-source-map',
    tracing: {
      tracesSampleRate: 1.0,
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: ['mount', 'update'],
          timeout: 2000,
          trackComponents: true,
        },
      },
      browserOptions: {},
    },
  },

  // Router and middleware configuration
  router: {
    middleware: ['check-ie', 'okta-auth'],
    base: process.env.APP_BASE_URL || '/new/app',
  },

  // Runtime configuration variables
  publicRuntimeConfig: {
    // API root, used to construct API URLs within components
    apiBase: process.env.API_BASE_URL || process.env.API_BASE || '/new/api',
    // Nuxt-Auth user key containing an array of permission group strings
    userPermissionKey: process.env.USER_PERMISSION_KEY || 'org.ukrdc.permissions',
    // Okta domain
    oktaDomain: process.env.OKTA_DOMAIN || 'https://renalregistry.okta.com',
    // System info variables
    githubRef: process.env.GITHUB_REF || 'Not Available',
    githubSha: process.env.GITHUB_SHA || 'Not Available',
    deploymentEnv: process.env.DEPLOYMENT_ENV || 'development',
    // Sentry public runtime config, see https://sentry.nuxtjs.org/sentry/runtime-config/
    sentry: {
      config: {
        environment: process.env.DEPLOYMENT_ENV || 'development',
      },
    },
    // Okta JS runtime config
    okta: {
      issuer: process.env.OAUTH_ISSUER,
      clientId: process.env.APP_CLIENT_ID,
      redirectUri: '/login',
      postLogoutRedirectUri: '/login',
      // Use authorization_code flow
      responseType: 'code',
      pkce: true,
      // Extra options
      scopes: ['openid', 'profile', 'email', 'offline_access'],
    },
  },
}
