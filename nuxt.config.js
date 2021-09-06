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
    { ssr: true, src: '~/plugins/vuex-persistedstate.ts' },
    { ssr: false, src: '~/plugins/v-calendar.ts' },
    { ssr: false, src: '~/plugins/v-tooltip.ts' },
    { ssr: false, src: '~/plugins/toast.ts' },
    { ssr: false, src: '~/plugins/axios-toast.ts' },
    { ssr: true, src: '~/plugins/axios-sentry.ts' },
    { ssr: false, src: '~/plugins/vue-clickaway.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api/module', '@nuxtjs/tailwindcss'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/sentry'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isDev, isClient }) {
      // Extend only webpack config for client-bundle
      if (isDev && isClient) {
        config.devtool = 'source-map'
      }
    },
  },

  // Sentry Configuration: https://sentry.nuxtjs.org/guide/setup
  sentry: {
    dsn: process.env.SENTRY_DSN,
    publishRelease: {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Attach commits to the release
      setCommits: {
        auto: true, // set by default
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

  // Auth Configuration: https://auth.nuxtjs.org/api/options
  auth: {
    strategies: {
      okta: {
        scheme: '~/schemes/oktaScheme',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: ['openid', 'profile', 'email', 'offline_access'],
        codeChallengeMethod: 'S256',
      },
    },
    // Error will occur if you refresh once Okta has expired your session
    // In this case, we need to logout and re-authenticate with Okta
    resetOnError: true,
  },

  // Router and middleware configuration
  router: {
    middleware: ['auth'],
    base: process.env.APP_BASE || '/',
  },

  // Basic axios configuration
  axios: {
    baseURL: 'http://localhost:8000', // Used as fallback if no runtime config is provided
  },

  // Runtime configuration variables
  publicRuntimeConfig: {
    // API root, used to construct API URLs within components
    apiBase: process.env.API_BASE || '/api',
    appBase: process.env.APP_BASE || '/',
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
    // Nuxt-Auth public runtime config
    auth: {
      strategies: {
        okta: {
          endpoints: {
            authorization: process.env.OAUTH_ISSUER + '/v1/authorize',
            token: process.env.OAUTH_ISSUER + '/v1/token',
            userInfo: process.env.OAUTH_ISSUER + '/v1/userinfo',
            logout: process.env.OKTA_DOMAIN + '/login/signout',
          },
          clientId: process.env.APP_CLIENT_ID,
        },
      },
    },
  },

  privateRuntimeConfig: {
    // Axios SSR-specific config
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
}
