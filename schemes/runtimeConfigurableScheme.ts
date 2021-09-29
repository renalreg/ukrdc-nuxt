import { Oauth2Scheme, Auth } from '@nuxtjs/auth-next/dist/runtime.js'
import { Oauth2SchemeOptions, SchemePartialOptions } from '@nuxtjs/auth-next/dist'
import { urljoin } from '@/helpers/utils/pathUtils'

export default class RuntimeConfigurableOauth2Scheme extends Oauth2Scheme {
  constructor($auth: Auth, options: SchemePartialOptions<Oauth2SchemeOptions>) {
    // Enable runtime configurable scheme options
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name],
    }

    // Fix runtime-configurable redirects
    // See https://github.com/nuxt-community/auth-module/issues/1070
    $auth.onRedirect((to: string, _: string): string => {
      const basePath = $auth.ctx.$config.appBase || $auth.ctx.base
      if (!process.server) return to
      if (to.startsWith(decodeURI(basePath))) return to
      return urljoin(basePath, to)
    })

    super($auth, configOptions)
  }
}
