import { computed } from "@nuxtjs/composition-api";
import { UserClaims } from "@okta/okta-auth-js";
import useAuth, { UKRDCClaims } from "./useAuth";

export default function () {
  const { signedIn, getAccessToken } = useAuth();

  function getPermissions(): string[] {
    const token = getAccessToken();
    if (token) {
      const payload: UserClaims<UKRDCClaims> = token.payload;
      return payload["org.ukrdc.permissions"] as string[];
    }

    return [];
  }

  function hasPermission(key: string): boolean {
    if (signedIn()) {
      // Fetch permissions array from the access token
      const permissions = getPermissions();
      if (permissions && permissions.includes(key)) {
        return true;
      }
    }
    return false;
  }

  function getFacilities(): string[] {
    if (signedIn()) {
      const permissions = getPermissions();
      if (permissions) {
        return permissions
          .filter((option) => option.toLowerCase().startsWith("ukrdc:unit:") && option.toLowerCase() !== "ukrdc:unit:*")
          .map((option) => option.replace("ukrdc:unit:", ""));
      }
    }
    return [];
  }

  const isAdmin = computed(() => hasPermission("ukrdc:unit:*"));

  const hasMultipleFacilities = computed(() => getFacilities().length > 1 || isAdmin.value);

  return { hasPermission, getPermissions, getFacilities, hasMultipleFacilities, isAdmin };
}
