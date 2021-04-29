import { Oauth2Scheme } from '@nuxtjs/auth-next/dist/runtime.js'

export default class RuntimeConfigurableOauth2Scheme extends Oauth2Scheme {
  constructor($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name],
    }
    super($auth, configOptions)
  }
}
