import { useContext } from "@nuxtjs/composition-api";
import {
  AdminApi,
  DashboardApi,
  SystemInfoApi,
  CodesApi,
  SearchApi,
  FacilitiesApi,
  MasterRecordsApi,
  PatientRecordsApi,
  BackgroundTasksApi,
  PatientIndexOperationsApi,
  MirthApi,
  WorkItemsApi,
} from "@ukkidney/ukrdc-axios-ts";
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
  const searchApi = new SearchApi(undefined, $config.api.host || "/", apiInstance);
  const facilitiesApi = new FacilitiesApi(undefined, $config.api.host || "/", apiInstance);
  const masterRecordsApi = new MasterRecordsApi(undefined, $config.api.host || "/", apiInstance);
  const patientRecordsApi = new PatientRecordsApi(undefined, $config.api.host || "/", apiInstance);
  const backgroundTasksApi = new BackgroundTasksApi(undefined, $config.api.host || "/", apiInstance);
  const patientIndexOperationsApi = new PatientIndexOperationsApi(undefined, $config.api.host || "/", apiInstance);
  const mirthApi = new MirthApi(undefined, $config.api.host || "/", apiInstance);
  const workItemsApi = new WorkItemsApi(undefined, $config.api.host || "/", apiInstance);

  return {
    adminApi,
    dashboardApi,
    systemInfoApi,
    codesApi,
    searchApi,
    facilitiesApi,
    masterRecordsApi,
    patientRecordsApi,
    backgroundTasksApi,
    patientIndexOperationsApi,
    mirthApi,
    workItemsApi,
  };
}
