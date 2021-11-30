import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'
import cookie from 'cookie'

import { Context } from '@nuxt/types'

// We use cookies to store the state of the vuex store, allowing SSR to work correctly
// See https://github.com/robinvdvleuten/vuex-persistedstate#using-cookies-universal-client--server-side

export default ({ store, isDev, req }: Context) => {
  createPersistedState({
    key: 'vuex.persisted_state.prefs',
    paths: ['prefs'],
    storage: {
      getItem: (key) => (process.client ? Cookies.get(key) : cookie.parse(req.headers.cookie || '')[key]),
      setItem: (key, value) => Cookies.set(key, value, { expires: 365, secure: !isDev }),
      removeItem: (key) => Cookies.remove(key),
    },
  })(store)
  // }
}
