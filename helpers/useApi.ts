import { useContext } from "@nuxtjs/composition-api";
import { AdminApi, DashboardApi, SystemInfoApi, CodesApi } from "@ukkidney/ukrdc-axios-ts";
import axios from "axios";

export default function () {
  const { $okta, $config } = useContext();

  const defaultHeaders = {
    Accept: "application/json",
  };

  // Create a custom axios instance
  const apiInstance = axios.create({
    headers: defaultHeaders,
  });

  // Request interceptor to handle API base paths and authentication
  apiInstance.interceptors.request.use((config) => {
    // Add the authorization header to each request
    const token = $okta.getAccessToken();
    if (config.headers === undefined) {
      config.headers = defaultHeaders;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Create API instances
  const adminApi = new AdminApi(undefined, $config.api.host || "/", apiInstance);
  const dashboardApi = new DashboardApi(undefined, $config.api.host || "/", apiInstance);
  const systemInfoApi = new SystemInfoApi(undefined, $config.api.host || "/", apiInstance);
  const codesApi = new CodesApi(undefined, $config.api.host || "/", apiInstance);

  return {
    adminApi,
    dashboardApi,
    systemInfoApi,
    codesApi,
  };
}
