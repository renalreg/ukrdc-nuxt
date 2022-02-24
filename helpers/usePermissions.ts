import { computed } from "@nuxtjs/composition-api";
import { JWTObject, UserClaims } from "@okta/okta-auth-js";
import useAuth from "./useAuth";

export interface UKRDCClaims {
  "org.ukrdc.permissions": string[];
}
export interface UKRDCJWTObject extends JWTObject {
  payload: UserClaims<UKRDCClaims>;
}

export default function () {
  const { accessToken } = useAuth();

  function getPermissions(): string[] | null {
    if (accessToken.value) {
      const token = accessToken.value as UKRDCJWTObject;
      const payload: UserClaims<UKRDCClaims> = token.payload;
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

  return { hasPermission, getPermissions, getFacilities, hasMultipleFacilities, isAdmin };
}
