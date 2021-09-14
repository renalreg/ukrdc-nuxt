/*
Automatically redirect to an error page on API fetch errors.
*/
import { Context } from '@nuxt/types'
import { ExpiredAuthSessionError } from '@nuxtjs/auth-next/dist/runtime'

interface PydanticError {
  loc: string[]
  msg: string
  type: string
}

function decodePydanticErrors(errors: PydanticError[]) {
  let errorMessage = 'Parameter Error\n'
  for (const error of errors) {
    const msg = `${error.loc.join('/')}: ${error.msg}`
    errorMessage += `${msg}\n`
  }
  return errorMessage
}

export default function ({ error, app, $axios, $sentry }: Context) {
  $axios.onError((err) => {
    // Let nuxt-auth handle logging out on ExpiredAuthSessionError
    if (error instanceof ExpiredAuthSessionError) {
      throw err
    }

    // Redirect to 404 without propagating Sentry or toast
    if (err.response?.status === 404) {
      error({ statusCode: 404, message: 'Page not found' })
      throw err
    }

    // Build message and redirect to 422 without propagating Sentry or toast
    if (err.response?.status === 422) {
      const msg = decodePydanticErrors(err.response.data.detail)
      error({ statusCode: 422, message: msg })
      throw err
    }

    // Compute what message to show in the toast
    if (process.client) {
      const msgToShow = err.response ? err.response.data.detail : err.message
      // If we have no message to show, don't create a toast
      if (msgToShow) {
        app.$toast.show({
          type: 'danger',
          title: 'Error Fetching Data',
          message: msgToShow,
          timeout: 5,
        })
      }
    }

    // Log the error to Sentry
    $sentry.captureException(error)

    // For severe internal server errors, log but also redirect to a generic error page
    if (err.response?.status === 500) {
      error({ statusCode: 500 })
    }
  })
}
