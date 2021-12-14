import createPersistedState from 'vuex-persistedstate'
import { Context } from '@nuxt/types'

// We don't need to use cookies to store the state of the vuex store, since we render all pages client-side.
// See https://github.com/robinvdvleuten/vuex-persistedstate#using-cookies-universal-client--server-side

export default ({ store }: Context) => {
  createPersistedState({
    key: 'vuex.persisted_state.prefs',
    paths: ['prefs'],
  })(store)
}
