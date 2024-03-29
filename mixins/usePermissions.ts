import { useContext } from '@nuxtjs/composition-api'

export default function () {
  const { $auth, $config } = useContext()

  function hasPermission(key: string): boolean {
    if ($auth.loggedIn && $auth.user) {
      // Obtain the user key containing the permissions array
      const permissionKey = $config.userPermissionKey || 'permission'
      // Fetch permissions array from the access token
      const permissions = $auth.user[permissionKey] as string[]
      if (permissions && permissions.includes(key)) {
        return true
      }
    }
    return false
  }

  function getPermissions(): string[] {
    if ($auth.loggedIn && $auth.user) {
      // Obtain the user key containing the permissions array
      const permissionKey = $config.userPermissionKey || 'permission'
      // Fetch permissions array from the access token
      return $auth.user[permissionKey] as string[]
    }
    return []
  }

  return { hasPermission, getPermissions }
}
