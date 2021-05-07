/*
Automatically handle expired auth on Axios requests
*/

export default function ({ $axios, $auth }) {
  $axios.onRequest(() => {
    const { tokenExpired, refreshTokenExpired } = $auth.check(true)
    // Force reset if refresh token has expired
    // Or if `autoLogout` is enabled and token has expired
    if (
      refreshTokenExpired ||
      (tokenExpired && $auth.strategy.options.autoLogout)
    ) {
      console.log('Auth token expired. Refreshing...')
      $auth.redirect('login')
    }
  })
}
