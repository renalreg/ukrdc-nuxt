export default {
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
    publishRelease: {
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
    },
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
    middleware: ['check-ie'],
    base: process.env.APP_BASE || '/',
  },

  // Basic axios configuration
  axios: {
    baseURL: 'http://localhost:8000', // Used as fallback if no runtime config is provided
  },

  // Runtime configuration variables
  publicRuntimeConfig: {
    baseURL: process.env.APP_BASE || '/',
    // API root, used to construct API URLs within components
    apiBase: process.env.API_BASE || '/api',
    // Nuxt-Auth user key containing an array of permission group strings
    userPermissionKey: process.env.USER_PERMISSION_KEY || 'org.ukrdc.permissions',
    // Okta domain
    oktaDomain: process.env.OKTA_DOMAIN || 'https://renalregistry.okta.com',
    // System info variables
    githubRef: process.env.GITHUB_REF || 'Not Available',
    githubSha: process.env.GITHUB_SHA || 'Not Available',
    deploymentEnv: process.env.DEPLOYMENT_ENV || 'development',
    // Axios public runtime config
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
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
      redirectUri: process.env.APP_BASE + '/login',
      // Use authorization_code flow
      responseType: 'code',
      pkce: true,
      // Extra options
      scopes: ['openid', 'profile', 'picture', 'email', 'offline_access'],
    },
  },

  privateRuntimeConfig: {
    // Axios SSR-specific config
    // This could be removed as we don't make API calls server-side, but it's here for completeness
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
}
