import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  // this.$hasPermission inside Vue components
  interface Vue {
    $hasPermission(permission: string): boolean
    $getPermission(): string[]
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$hasPermission inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $hasPermission(permission: string): boolean
    $getPermission(): string[]
  }
  // nuxtContext.$hasPermission
  interface Context {
    $hasPermission(permission: string): boolean
    $getPermission(): string[]
  }
}

const permissionsPlugin: Plugin = (ctx, inject) => {
  inject('hasPermission', (permission: string) => {
    if (ctx.$auth.loggedIn && ctx.$auth.user) {
      // Obtain the user key containing the permissions array
      const permissionKey = ctx.$config.userPermissionKey || 'permission'
      // Fetch permissions array from the access token
      const permissions = ctx.$auth.user[permissionKey] as string[]
      if (permissions && permissions.includes(permission)) {
        return true
      }
    }
    return false
  })

  inject('getPermission', () => {
    if (ctx.$auth.loggedIn && ctx.$auth.user) {
      // Obtain the user key containing the permissions array
      const permissionKey = ctx.$config.userPermissionKey || 'permission'
      // Fetch permissions array from the access token
      return ctx.$auth.user[permissionKey] as string[]
    }
  })
}

export default permissionsPlugin
