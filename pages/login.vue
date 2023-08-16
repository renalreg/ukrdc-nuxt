<template>
  <div class="justify-center text-center">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Signing you in...</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, useContext, useRoute, useRouter } from "@nuxtjs/composition-api";

import useAuth from "~/composables/useAuth";

export default defineComponent({
  // Override auth middleware. We handle redirects here ourselves in mounted()
  auth: false,

  setup() {
    const { $okta } = useContext();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      // If an originalUri was stored before navigating to this page, keep using it
      let originalUri = $okta.getOriginalUri();
      // Original URI should never be the login page (otherwise you just get stuck here)
      if (originalUri && originalUri !== route.value.path) {
        originalUri = undefined;
      }

      if ($okta.isLoginRedirect()) {
        // If we're in the middle of a sign-in flow
        // Fetch tokens and redirect back to originalUri
        $okta.handleLoginRedirect();
      } else if (!isAuthenticated.value) {
        // Start sign-in flow
        $okta.signInAuto(originalUri || "/");
      } else if (originalUri) {
        // If we're signed in and an originalUri somehow exists
        router.replace({ path: originalUri });
      } else {
        // If we're signed in and no originalUri exists
        // Redirect to home
        router.replace({ path: "/" });
      }
    });

    onMounted(() => {
      // Sometimes the onBeforeMount fails to redirect, possibly a race condition?
      // Use this to ensure we redirect properly if authenticated by the time the page is mounted

      if (isAuthenticated.value) {
        // If an originalUri was stored before navigating to this page, keep using it
        const originalUri = $okta.getOriginalUri();

        if (originalUri) {
          // If we're signed in and an originalUri somehow exists
          router.replace({ path: originalUri });
        } else {
          // If we're signed in and no originalUri exists
          // Redirect to home
          router.replace({ path: "/" });
        }
      }
    });
  },
  head: {
    title: "Login",
  },
});
</script>
