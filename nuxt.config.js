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
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Auth Configuration: https://auth.nuxtjs.org/api/options
  auth: {
    strategies: {
      auth0: {
        domain: 'renalreg.eu.auth0.com',
        clientId: 'SQCWWXi1rbZ4GY7aqjYXDBe0pyeJ7f7X',
        audience: 'https://app.ukrdc.org/api',
        scope: ['openid', 'profile', 'email', 'offline_access'],
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

  // Runtime configuration variables
  publicRuntimeConfig: {
    axios: {
      // Base URL when calling from a users browser
      browserBaseURL:
        process.env.PUBLIC_API_BASE ||
        process.env.API_BASE ||
        'http://localhost:8000',
    },
  },

  privateRuntimeConfig: {
    axios: {
      // Base URL when calling from the rendering server
      baseURL:
        process.env.LOCAL_API_BASE ||
        process.env.API_BASE ||
        'http://localhost:8000',
    },
  },
}
