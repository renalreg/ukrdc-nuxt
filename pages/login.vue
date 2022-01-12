<template>
  <div class="justify-center text-center">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Redirecting to login...</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, useRouter } from '@nuxtjs/composition-api'

import useAuth from '~/helpers/useAuth'

export default defineComponent({
  // Override auth middleware. We handle redirects here ourselves in mounted()
  auth: false,

  setup() {
    const { oktaAuth, signedIn } = useAuth()
    const router = useRouter()

    onBeforeMount(() => {
      const originalUri = oktaAuth.getOriginalUri()
      if (oktaAuth.isLoginRedirect()) {
        // If we're in the middle of a sign-in flow
        // Fetch tokens and redirect back to originalUri
        oktaAuth.handleLoginRedirect()
      } else if (!signedIn()) {
        // If we're not currently signed in
        // Check if we were redirected here from another page
        if (!originalUri) {
          // If we weren't redirected here from another page,
          // redirect back to the home page after login
          oktaAuth.setOriginalUri('/')
        }
        // Start sign-in flow
        oktaAuth.signInWithRedirect()
      } else if (originalUri) {
        // If we're signed in and an originalUri somehow exists
        router.replace({ path: originalUri })
      } else {
        // If we're signed in and no originalUri exists
        // Redirect to home
        router.replace({ path: '/' })
      }
    })

    return {
      oktaAuth,
    }
  },
  head: {
    title: 'Login',
  },
})
</script>
