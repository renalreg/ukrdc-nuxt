/*
Injects an $okta object into the Vue instance and context,
allowing components to interact with a shared OktaAuth instance.
*/

import { Plugin } from '@nuxt/types'

import { OktaAuth } from '@okta/okta-auth-js'

declare module 'vue/types/vue' {
  interface Vue {
    $okta: OktaAuth
  }
}

declare module '@nuxt/types' {
  // nuxtContext.$myInjectedFunction
  interface Context {
    $okta: OktaAuth
  }
}

const oktaPlugin: Plugin = (_ctx, inject) => {
  // Fetch (runtime) config from context
  const configOptions = _ctx.$config.okta

  // Create OktaAuth instance
  const oktaAuth = new OktaAuth(configOptions)

  // Inject oktaAuth into Vue
  inject('okta', oktaAuth)
}

export default oktaPlugin
