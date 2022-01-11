/*
Injects an $okta object into the Vue instance and context,
allowing components to interact with a shared OktaAuth instance.
*/

import { Plugin } from '@nuxt/types'

import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'

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

  // Start the auth background service
  console.debug('Starting OktaAuth service...')
  oktaAuth.start()

  // Look for a router instance to handle URI restoration
  const router = _ctx.app.router
  if (!oktaAuth.options.restoreOriginalUri) {
    // eslint-disable-next-line require-await
    oktaAuth.options.restoreOriginalUri = async (_: OktaAuth, originalUri: string) => {
      console.log('restoring URI')
      // If a router is available, provide a default implementation
      if (router && originalUri) {
        const path = toRelativeUrl(originalUri, window.location.origin)
        router.replace({ path })
      }
    }
  }

  // Inject oktaAuth into Vue
  inject('okta', oktaAuth)
}

export default oktaPlugin
