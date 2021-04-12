/*
Automatically send Axios error reports to Sentry.
*/

export default function ({ $axios, $sentry }) {
  $axios.onError((error) => {
    console.log('Error reported to developers via Sentry')
    $sentry.captureException(error)
  })
}
