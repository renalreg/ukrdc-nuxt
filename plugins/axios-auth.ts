/*
Automatically redirect to an error page on API fetch errors.
*/
import { Context } from '@nuxt/types'

export default function ({ $axios, $auth }: Context) {
  $axios.onError((thisError) => {
    // Let nuxt-auth handle logging out on ExpiredAuthSessionError
    // Using `thisError instanceof ExpiredAuthSessionError` doesn't seem to work, possibly
    // due to something like https://github.com/microsoft/TypeScript/issues/13965
    if (thisError.name === 'ExpiredAuthSessionError') {
      // We get an ExpiredAuthSessionError if Nuxt-Auth has failed to find a valid token,
      // and was unable to refresh it. Nuxt-Auth will handle resetting the auth state,
      // which would mean that if the user navigates to another page, the router middleware
      // added by Nuxt-Auth will redirect to the login page, however Axios requests don't
      // trigger the router middleware, so we need to manually redirect here.
      $auth.loginWith('okta')
    }
  })
}
