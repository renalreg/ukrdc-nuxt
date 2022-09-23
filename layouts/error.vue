<template>
  <div class="flex h-full flex-col items-center justify-center">
    <div class="block items-center justify-center sm:flex">
      <h1 class="sm:mr-8">{{ error.statusCode || "Error" }}</h1>
      <div class="sm:border-l sm:pl-8">
        <h1 class="whitespace-pre">{{ errorTitle }}</h1>
        <NuxtLink to="/">Home page</NuxtLink>
      </div>
    </div>
    <div v-if="errorDetail">
      <p>{{ errorDetail }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { NuxtError } from "@nuxt/types";
import { computed, defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  layout: "error",
  props: {
    error: {
      type: Object as () => NuxtError,
      required: true,
    },
  },
  setup(props) {
    const friendlyErrorStatus: { [key: number]: string } = {
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Required",
      413: "Request Entry Too Large",
      414: "Request-URI Too Long",
      415: "Unsupported Media Type",
      416: "Requested Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a teapot",
      429: "Too Many Requests",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
    };

    const errorTitle = computed(() => {
      if (props.error.statusCode && props.error.statusCode in friendlyErrorStatus) {
        return friendlyErrorStatus[props.error.statusCode] || "Error";
      }
      return "Error";
    });

    const errorDetail = computed(() => {
      return props.error.message || "";
    });

    return { errorTitle, errorDetail };
  },
});
</script>

<style lang="postcss">
h1 {
  @apply text-6xl font-bold text-indigo-600;
}
</style>
