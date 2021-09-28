<template>
  <div class="justify-center text-center">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Redirecting to login...</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
  auth: false,

  setup() {
    const route = useRoute()
    const { $auth } = useContext()

    onMounted(() => {
      // If we're not logged in, either start logging in,
      // or wait for login flow to finish before redirecting home.
      if (!$auth.loggedIn) {
        // If we're here with a code parameter,
        // let the Auth module finish the PKCE flow without redirecting again.
        // Otherwise, start the Okta login flow.
        if (!route.value.query.code) {
          $auth.loginWith('okta')
        }
        // If we are logged in and don't have a code parameter
      } else if (!route.value.query.code) {
        // Use $auth.redirect so rewriteRedirects works properly
        // I.e. if we were sent to /login by another page because
        // our token expired, we want to go back to that page, not
        // home. $auth.redirect handles checking where we came from,
        // so we know where to go. Something something cotton-eye Joe.
        $auth.redirect('home')
      }
    })
  }, // Override auth middleware. We handle redirects here ourselves in mounted()
  head: {
    title: 'Login',
  },
})
</script>
