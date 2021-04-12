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
    plugins: ['~/plugins/auth.js'],
    strategies: {
      auth0: {
        scheme: '~/schemes/auth0ExtendedScheme',
        domain: 'renalreg.eu.auth0.com',
        clientId: 'SQCWWXi1rbZ4GY7aqjYXDBe0pyeJ7f7X',
        audience: 'https://app.ukrdc.org/api',
        scope: [
          'openid',
          'profile',
          'email',
          'offline_access',
          'read:patientrecords',
          'write:patientrecords',
          'read:empi',
          'write:empi',
          'read:workitems',
          'write:workitems',
          'read:mirth',
          'write:mirth',
        ],
        responseType: 'code',
        grantType: 'authorization_code',
        codeChallengeMethod: 'S256',
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
    apiBase: process.env.API_BASE || '/api',
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
      config: {
        disabled: !process.env.SENTRY_DSN,
      },
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
}
