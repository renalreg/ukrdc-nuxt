import { Oauth2Scheme } from '@nuxtjs/auth-next/dist/runtime.js'
import { urljoin } from '@/helpers/utils/pathUtils'

export default class RuntimeConfigurableOauth2Scheme extends Oauth2Scheme {
  constructor($auth, options) {
    // Enable runtime configurable scheme options
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name],
    }

    // Fix runtime-configurable redirects
    // See https://github.com/nuxt-community/auth-module/issues/1070
    $auth.onRedirect((to, _) => {
      const basePath = $auth.ctx.$config.appBase || $auth.ctx.base
      if (!process.server) return
      if (to.startsWith(decodeURI(basePath))) return to
      return urljoin(basePath, to)
    })

    super($auth, configOptions)
  }
}
