/*
Automatically send Axios error reports to Sentry.
*/
import { Context } from '@nuxt/types'
import { ExpiredAuthSessionError } from '@nuxtjs/auth-next/dist/runtime'

export default function ({ $axios, $sentry }: Context) {
  $axios.onError((error) => {
    // Let nuxt-auth handle logging out on ExpiredAuthSessionError
    if (!(error instanceof ExpiredAuthSessionError)) {
      console.log('Error reported to developers via Sentry')
      $sentry.captureException(error)
    }
  })
}
