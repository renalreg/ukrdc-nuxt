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
  MessagesApi,
} from "@ukkidney/ukrdc-axios-ts";
import axios from "axios";

interface PydanticError {
  loc: string[];
  msg: string;
  type: string;
}

function decodePydanticErrors(errors: PydanticError[]) {
  let errorMessage = "Parameter Error\n";
  for (const error of errors) {
    const msg = `${error.loc.join("/")}: ${error.msg}`;
    errorMessage += `${msg}\n`;
  }
  return errorMessage;
}

export default function () {
  const { $okta, $toast, $sentry } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

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

  // Response interceptor to handle API errors
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // A 401 error from the API means unauthenticated, which usually only happens if the user
      // has started a new session and the API Axios instance has sent a request before Okta has
      // had chance to refresh. In this case we just want to exit the request early and let Okta
      // handle the refresh.
      if (error.response?.status === 401) {
        // Return early
        throw error;
      }

      // For API 404 errors a resource is usually missing or unavailable, and is
      // generally handled by the component that triggered the request. Don't show toasts or log.
      if (error.response?.status === 404) {
        // Return early
        throw error;
      }

      // For internal API server errors, redirect to 500 without propagating Sentry or toast
      // We're assuming here that the API server will log the related error, and so logging
      // here just leads to duplicate messages.
      if (error.response?.status === 500) {
        error({ statusCode: 500, message: "Internal server error" });
        // Return early
        throw error;
      }

      // Build message and redirect to 422 without propagating Sentry or toast
      if (error.response?.status === 422) {
        const msg = decodePydanticErrors(error.response.data.detail);
        error({ statusCode: 422, message: msg });
        // Return early
        throw error;
      }

      // Compute what message to show in the toast
      if (process.client) {
        const msgToShow = error.response ? error.response.data.detail : error.message;
        // If we have no message to show, don't create a toast
        if (msgToShow) {
          $toast.show({
            type: "danger",
            title: "Error Fetching Data",
            message: msgToShow,
            timeout: 5,
          });
        }
      }

      // Log the error to Sentry
      $sentry.captureException(error);
    }
  );

  // Create API instances
  const adminApi = new AdminApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const dashboardApi = new DashboardApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const systemInfoApi = new SystemInfoApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const codesApi = new CodesApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const searchApi = new SearchApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const facilitiesApi = new FacilitiesApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const masterRecordsApi = new MasterRecordsApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const patientRecordsApi = new PatientRecordsApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const backgroundTasksApi = new BackgroundTasksApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const patientIndexOperationsApi = new PatientIndexOperationsApi(
    undefined,
    runtimeConfig.api.host || "/",
    apiInstance
  );
  const mirthApi = new MirthApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const workItemsApi = new WorkItemsApi(undefined, runtimeConfig.api.host || "/", apiInstance);
  const messagesApi = new MessagesApi(undefined, runtimeConfig.api.host || "/", apiInstance);

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
    messagesApi,
  };
}