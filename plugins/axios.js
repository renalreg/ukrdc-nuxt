export default function ({ $axios, $sentry, $toast }) {
  $axios.onError((error) => {
    $toast.show({
      type: 'danger',
      title: 'Error Fetching Data',
      message: error.message,
      timeout: 5,
      classTimeout: 'bg-red-600',
    })
    $sentry.captureException(error)
  })
}
