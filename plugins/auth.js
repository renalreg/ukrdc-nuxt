const urljoin = require('url-join')

export default ({ $auth, $config }) => {
  // See https://github.com/nuxt-community/auth-module/issues/1070
  $auth.onRedirect((to, _) => {
    const basePath = ($config.app || $config._app).basePath
    console.log($config)
    console.log(basePath)
    if (!process.server) return
    if (to.startsWith(decodeURI(basePath))) return to
    return urljoin(basePath, to)
  })
}
