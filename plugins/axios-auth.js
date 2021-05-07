/*
By default, nuxt-auth will reset authentication if an Axios request is sent and
the refresh token has expired, raising a ExpiredAuthSessionError.

We want to be a little bit more seamless however, so instead we redirect the
user to login, and if they're still logged into the SSO provider, will silently
be re-authenticated and returned to the web app.

This allows us to shorten the lifetime of rotating refresh tokens, which is nice!
*/

export default function ({ $axios, $auth }) {
  $axios.onRequest(() => {
    const { refreshTokenExpired } = $auth.check(true)
    // Force login if refresh token has expired
    if (refreshTokenExpired) {
      console.log('Refresh token expired. Redirecting to login...')
      $auth.redirect('login')
    }
  })
}
