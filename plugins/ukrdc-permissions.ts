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
      // Obtain the user key containing the permissions array
      const permissionsKey = ctx.$config.userPermissionsKey || 'permissions'
      // Fetch permissions array from the access token
      const permissions = ctx.$auth.user[permissionsKey] as string[]
      if (permissions && permissions.includes(permission)) {
        return true
      }
    }
    return false
  })
}

export default permissionsPlugin
