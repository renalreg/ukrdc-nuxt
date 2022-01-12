/*
Injects an $okta object into the Vue instance and context,
allowing components to interact with a shared OktaAuth instance.
*/

import { Plugin } from '@nuxt/types'

import { OktaAuth } from '@okta/okta-auth-js'
import { urljoin } from '~/helpers/utils/pathUtils'

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
  // Common variables
  const router = _ctx.app.router
  const basePath = router?.options.base || '/'

  // Fetch (runtime) config from context
  const configOptions = _ctx.$config.okta

  // Assert router base is prepended to callback URLs
  if (configOptions.postLogoutRedirectUri) {
    configOptions.postLogoutRedirectUri = urljoin(basePath, configOptions.postLogoutRedirectUri)
  }
  if (configOptions.redirectUri) {
    configOptions.redirectUri = urljoin(basePath, configOptions.redirectUri)
  }

  console.log(configOptions)

  // Create OktaAuth instance
  const oktaAuth = new OktaAuth(configOptions)

  // Start the auth background service
  console.debug('Starting OktaAuth service...')
  oktaAuth.start()

  // Look for a router instance to handle URI restoration
  if (!oktaAuth.options.restoreOriginalUri) {
    // eslint-disable-next-line require-await
    oktaAuth.options.restoreOriginalUri = async (_: OktaAuth, originalUri: string) => {
      // If a router is available, provide a default implementation
      if (router && originalUri) {
        // Our originalUri will always be a router path (i.e. route.value.fullPath, see useAuth.ts),
        // so we can pass it straight through to the router without any further modifications.
        router.replace({ path: originalUri })
      }
    }
  }

  // Inject oktaAuth into Vue
  inject('okta', oktaAuth)
}

export default oktaPlugin
