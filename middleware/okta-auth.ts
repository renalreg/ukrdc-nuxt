import { Context } from '@nuxt/types'
import Vue, { ComponentOptions } from 'vue'

// Extended Vue component type providing access to all component options
export interface VueComponent extends ComponentOptions<Vue> {
  options: { [key: string]: any }
}
// Modified Route types using our extended VueComponent type
type MatchedRoute = { components: VueComponent[] }
type Route = { matched: MatchedRoute[] }

function routeOption(route: Route, key: string, value: string | boolean): boolean {
  // A route can (technically) be associated with multiple Components,
  // so we pass a value we're looking for in each component's options
  // and return true if any of them have the value.
  return route.matched.some((m) => {
    return Object.values(m.components).some((component) => component.options && component.options[key] === value)
  })
}

export default function ({ route, redirect, $okta }: Context) {
  const skipAuth = routeOption(route as unknown as Route, 'auth', false)
  if (!skipAuth) {
    const authState = $okta.authStateManager.getAuthState()
    const signedIn = authState && authState.isAuthenticated
    if (!signedIn) {
      $okta.setOriginalUri(route.fullPath)
      redirect('/login')
    }
  }
  return Promise.resolve()
}
