import { useContext } from "@nuxtjs/composition-api";
import {
  AdminApi,
  BackgroundTasksApi,
  CodesApi,
  DashboardApi,
  FacilitiesApi,
  MasterRecordsApi,
  MessagesApi,
  MirthApi,
  PatientIndexOperationsApi,
  PatientRecordsApi,
  SearchApi,
  SystemInfoApi,
  UKRDCRecordGroupApi,
  WorkItemsApi,
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
  const { $okta, $toast, $sentry, $config, error } = useContext();

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
    (e) => {
      // We handle some error status codes specially

      // A 401 error from the API means unauthenticated, which usually only happens if the user
      // has started a new session and the API Axios instance has sent a request before Okta has
      // had chance to refresh. In this case we just want to exit the request early and let Okta
      // handle the refresh.
      if (e.response?.status === 401) {
        // Return early
        throw e;
      }

      // For API 404 errors a resource is usually missing or unavailable, and is
      // generally handled by the component that triggered the request. Don't show toasts or log.
      if (e.response?.status === 404) {
        // Return early
        throw e;
      }

      // For internal API server errors, redirect to 500 without propagating Sentry or toast
      // We're assuming here that the API server will log the related error, and so logging
      // here just leads to duplicate messages.
      if (e.response?.status === 0 || e.response?.status === 500) {
        error({ statusCode: 500, message: "An internal error occured. Our developers have been notified." });
        // Return early
        throw e;
      }

      // Build message and redirect to 422 without propagating Sentry or toast
      if (e.response?.status === 422) {
        const msg = decodePydanticErrors(e.response.data.detail);
        error({ statusCode: 422, message: msg });
        // Return early
        throw e;
      }

      // All other error status codes

      // Compute what message to show in the toast
      if (process.client) {
        const msgToShow = e.response?.data ? e.response.data.detail : e.message;

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
      $sentry.captureException(e);

      // Re-throw the error so that the component that triggered the request can handle it
      throw e;
    },
  );

  let baseUrl: string;
  // If we actually set the baseUrl to / then request URLs become absolute, e.g. https://api/v1/...
  // If we set it to an empty string then the host defaults to localhost.
  // This is not what we want, so we need to replace these cases with window.location.host.
  if (!$config.api.host || $config.api.host === "/") {
    baseUrl = `${$config.api.protocol}://${window.location.host}`;
  } else {
    baseUrl = `${$config.api.protocol}://${$config.api.host}`;
  }

  // Create API instances
  const adminApi = new AdminApi(undefined, baseUrl, apiInstance);
  const dashboardApi = new DashboardApi(undefined, baseUrl, apiInstance);
  const systemInfoApi = new SystemInfoApi(undefined, baseUrl, apiInstance);
  const codesApi = new CodesApi(undefined, baseUrl, apiInstance);
  const searchApi = new SearchApi(undefined, baseUrl, apiInstance);
  const facilitiesApi = new FacilitiesApi(undefined, baseUrl, apiInstance);
  const masterRecordsApi = new MasterRecordsApi(undefined, baseUrl, apiInstance);
  const patientRecordsApi = new PatientRecordsApi(undefined, baseUrl, apiInstance);
  const backgroundTasksApi = new BackgroundTasksApi(undefined, baseUrl, apiInstance);
  const patientIndexOperationsApi = new PatientIndexOperationsApi(undefined, baseUrl, apiInstance);
  const mirthApi = new MirthApi(undefined, baseUrl, apiInstance);
  const workItemsApi = new WorkItemsApi(undefined, baseUrl, apiInstance);
  const messagesApi = new MessagesApi(undefined, baseUrl, apiInstance);
  const ukrdcRecordGroupApi = new UKRDCRecordGroupApi(undefined, baseUrl, apiInstance);

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
    ukrdcRecordGroupApi,
  };
}
