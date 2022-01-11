import { useContext, computed } from '@nuxtjs/composition-api'
import useAuth from './useAuth'

export default function () {
  const { $config } = useContext()
  const { loggedIn, getUser } = useAuth()

  function getPermissions(): string[] {
    if (loggedIn()) {
      getUser().then((user) => {
        console.log(user)
        // Obtain the user key containing the permissions array
        const permissionKey = $config.userPermissionKey || 'permission'
        return user[permissionKey] as string[]
      })
    }
    return []
  }

  function hasPermission(key: string): boolean {
    if (loggedIn()) {
      // Fetch permissions array from the access token
      const permissions = getPermissions()
      if (permissions && permissions.includes(key)) {
        return true
      }
    }
    return false
  }

  function getFacilities(): string[] {
    if (loggedIn() && getUser()) {
      const permissions = getPermissions()
      if (permissions) {
        return permissions
          .filter((option) => option.toLowerCase().startsWith('ukrdc:unit:') && option.toLowerCase() !== 'ukrdc:unit:*')
          .map((option) => option.replace('ukrdc:unit:', ''))
      }
    }
    return []
  }

  const isAdmin = computed(() => hasPermission('ukrdc:unit:*'))

  const hasMultipleFacilities = computed(() => getFacilities().length > 1 || isAdmin.value)

  return { hasPermission, getPermissions, getFacilities, hasMultipleFacilities, isAdmin }
}
