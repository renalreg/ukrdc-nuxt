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
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/sentry'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Sentry Configuration: https://sentry.nuxtjs.org/guide/setup
  sentry: {
    publishRelease: true,
  },

  // Auth Configuration: https://auth.nuxtjs.org/api/options
  auth: {
    // We need this plugin for https://github.com/nuxt-community/auth-module/issues/1070
    plugins: ['~/plugins/auth-redirect.js'],
    strategies: {
      okta: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.OAUTH_ISSUER + '/v1/authorize',
          token: process.env.OAUTH_ISSUER + '/v1/token',
          userInfo: process.env.OAUTH_ISSUER + '/v1/userinfo',
          logout: process.env.OAUTH_ISSUER + '/v1/logout',
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800,
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: process.env.CLIENT_ID,
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: 'S256',
        autoLogout: true,
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
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
    // Access token key containing an array of permission group strings
    accessTokenPermissionsKey:
      process.env.ACCESS_TOKEN_PERMISSIONS_KEY || 'ukrdc',
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
  },

  privateRuntimeConfig: {
    // Axios SSR-specific config
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
}
