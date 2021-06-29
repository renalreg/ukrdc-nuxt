/*
Automatically display Axios error toasts.
*/
import { Context } from '@nuxt/types'

export default function ({ app, $axios }: Context) {
  $axios.onError((error) => {
    app.$toast.show({
      type: 'danger',
      title: 'Error Fetching Data',
      message: error.message,
      timeout: 5,
    })
  })
}
