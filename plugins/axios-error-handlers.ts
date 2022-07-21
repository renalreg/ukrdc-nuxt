/*
Automatically redirect to an error page on API fetch errors.
*/
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

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$api.onError((thisError) => {
    let msgToShow = thisError.response ? thisError.response.data.detail : thisError.message;

    // A 401 error from the API means unauthenticated, which usually only happens if the user
    // has started a new session and the API Axios instance has sent a request before Okta has
    // had chance to refresh. In this case we just want to exit the request early and let Okta
    // handle the refresh.
    if (thisError.response?.status === 401) {
      // Return early
      throw thisError;
    }

    // For API 404 errors a resource is usually missing or unavailable, and is
    // generally handled by the component that triggered the request. Don't show toasts or log.
    if (thisError.response?.status === 404) {
      // Return early
      throw thisError;
    }

    // For internal API server errors, raise without propagating Sentry
    // We're assuming here that the API server will log the related error, and so logging
    // here just leads to duplicate messages.
    if (thisError.response?.status === 500) {
      throw thisError;
    }

    // Build custom message for Pydantic errors
    if (thisError.response?.status === 422) {
      msgToShow = decodePydanticErrors(thisError.response.data.detail);
    }

    // Show an error toast
    // If we have no message to show, don't create a toast
    if (process.client && msgToShow) {
      nuxtApp.$toast.show({
        type: "danger",
        title: "Error Fetching Data",
        message: msgToShow,
        timeout: 5,
      });
    }

    // Log the error to Sentry
    console.log("Reporting error to Sentry, if available.");
    nuxtApp.$sentry.captureException(thisError);
  });
});
