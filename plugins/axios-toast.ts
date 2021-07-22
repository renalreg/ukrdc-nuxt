/*
Automatically display Axios error toasts.
*/
import { Context } from '@nuxt/types'
import { ExpiredAuthSessionError } from '@nuxtjs/auth-next/dist/runtime'

export default function ({ app, $axios }: Context) {
  $axios.onError((error) => {
    if (error instanceof ExpiredAuthSessionError) {
      return
    }
    app.$toast.show({
      type: 'danger',
      title: 'Error Fetching Data',
      message: error.message,
      timeout: 5,
    })
  })
}
