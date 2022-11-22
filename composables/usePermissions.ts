import { computed } from "@nuxtjs/composition-api";

import useAuth, { UKRDCClaims, UKRDCJWTObject } from "./useAuth";

export default function () {
  const { accessToken } = useAuth();

  function getPermissions(): string[] | null {
    if (accessToken.value) {
      const token = accessToken.value as UKRDCJWTObject;
      const payload: UKRDCClaims = token.payload;
      return payload["org.ukrdc.permissions"] as string[];
    }
    return null;
  }

  function hasPermission(key: string): boolean {
    // Fetch permissions array from the access token
    const permissions = getPermissions();
    if (permissions && permissions.includes(key)) {
      return true;
    }
    return false;
  }

  function getFacilities(): string[] | null {
    const permissions = getPermissions();
    if (permissions) {
      return permissions
        .filter((option) => option.toLowerCase().startsWith("ukrdc:unit:") && option.toLowerCase() !== "ukrdc:unit:*")
        .map((option) => option.replace("ukrdc:unit:", ""));
    }
    return null;
  }

  const availableFacilities = computed(() => {
    return getFacilities();
  });

  const firstFacility = computed(() => {
    if (availableFacilities.value) {
      if (availableFacilities.value.length > 0) {
        return availableFacilities.value[0];
      }
    }
    return null;
  });

  const isAdmin = computed(() => hasPermission("ukrdc:unit:*"));

  const hasMultipleFacilities = computed(() => {
    // Assume admins always have all facility access
    if (isAdmin.value) {
      return true;
    } else {
      // Check if there are multiple facilities
      const facilities = getFacilities();
      return facilities ? facilities.length > 1 : false;
    }
  });

  return {
    hasPermission,
    getPermissions,
    getFacilities,
    availableFacilities,
    firstFacility,
    hasMultipleFacilities,
    isAdmin,
  };
}
