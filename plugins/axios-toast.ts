/*
Automatically display Axios error toasts.
*/
import { Context } from '@nuxt/types'
import { ExpiredAuthSessionError } from '@nuxtjs/auth-next/dist/runtime'

export default function ({ app, $axios }: Context) {
  $axios.onError((error) => {
    // Let nuxt-auth handle logging out on ExpiredAuthSessionError
    if (!(error instanceof ExpiredAuthSessionError)) {
      app.$toast.show({
        type: 'danger',
        title: 'Error Fetching Data',
        message: error.response ? error.response.data.detail : error.message,
        timeout: 5,
      })
    }
  })
}
