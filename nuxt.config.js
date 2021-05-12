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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  server: {
    host: process.env.HOST || 'localhost',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { ssr: false, src: '~/plugins/v-calendar.js' },
    { ssr: false, src: '~/plugins/toast.ts' },
    { ssr: false, src: '~/plugins/axios-toast.js' },
    { ssr: true, src: '~/plugins/axios-sentry.js' },
    { ssr: true, src: '~/plugins/ukrdc-permissions.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/sentry'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Sentry Configuration: https://sentry.nuxtjs.org/guide/setup
  sentry: {
    publishRelease: true,
    tracing: true,
  },

  // Auth Configuration: https://auth.nuxtjs.org/api/options
  auth: {
    strategies: {
      okta: {
        scheme: '~/schemes/runtimeConfigurableScheme',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: ['openid', 'profile', 'email', 'offline_access'],
        codeChallengeMethod: 'S256',
      },
    },
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
    userPermissionKey:
      process.env.USER_PERMISSION_KEY || 'org.ukrdc.permissions',
    // Okta domain
    oktaDomain: process.env.OKTA_DOMAIN || 'https://renalregistry.okta.com',
    // Axios public runtime config
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
    // Sentry public runtime config
    sentry: {
      dsn: process.env.SENTRY_DSN,
      config: {
        disabled: !process.env.SENTRY_DSN,
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
            logout: process.env.OAUTH_ISSUER + '/v1/logout',
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
