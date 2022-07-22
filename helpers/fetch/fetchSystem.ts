import { ServerSystemInfo, UserPreferences } from "~/interfaces/system";

export default function () {
  const { $api } = useNuxtApp();

  async function fetchServerInfo(): Promise<ServerSystemInfo> {
    return (await $api.$get("/v1/system/info/")) as ServerSystemInfo;
  }

  async function fetchUserPreferences(): Promise<UserPreferences> {
    return (await $api.$get("/v1/system/user/preferences/")) as UserPreferences;
  }

  async function putUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
    return (await $api.$put("/v1/system/user/preferences/", preferences)) as UserPreferences;
  }

  return { fetchServerInfo, fetchUserPreferences, putUserPreferences };
}
