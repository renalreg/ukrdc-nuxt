const urljoin = require('url-join')

export default ({ $auth, $config }) => {
  // See https://github.com/nuxt-community/auth-module/issues/1070
  $auth.onRedirect((to, _) => {
    if (!process.server) return
    if (to.startsWith(decodeURI($config.app.basePath))) return to
    return urljoin($config.app.basePath, to)
  })
}
