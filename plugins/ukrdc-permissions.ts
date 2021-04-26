import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  // this.$hasPermission inside Vue components
  interface Vue {
    $hasPermission(permission: string): boolean
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$hasPermission inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $hasPermission(permission: string): boolean
  }
  // nuxtContext.$hasPermission
  interface Context {
    $hasPermission(permission: string): boolean
  }
}

const permissionsPlugin: Plugin = (ctx, inject) => {
  inject('hasPermission', (permission: string) => {
    if (ctx.$auth.loggedIn && ctx.$auth.user?.ukrdc) {
      const permissions = ctx.$auth.user.ukrdc as string[]
      if (permissions.includes(permission)) {
        return true
      }
    }
    return false
  })
}

export default permissionsPlugin
