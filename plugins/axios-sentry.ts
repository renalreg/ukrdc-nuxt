/*
Automatically send Axios error reports to Sentry.
*/
import { Context } from '@nuxt/types'

export default function ({ $axios, $sentry }: Context) {
  $axios.onError((error) => {
    console.log('Error reported to developers via Sentry')
    $sentry.captureException(error)
  })
}
