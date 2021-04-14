/*
Automatically display Axios error toasts.
*/

export default function ({ app, $axios }) {
  $axios.onError((error) => {
    app.$toast.show({
      type: 'danger',
      title: 'Error Fetching Data',
      message: error.message,
      timeout: 5,
    })
  })
}
