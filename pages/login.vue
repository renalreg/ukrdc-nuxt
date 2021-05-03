<template>
  <div class="justify-center text-center max-w-7xl">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Redirecting to login...
    </h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  auth: false, // Override auth middleware. We handle redirects here ourselves in mounted()
  head() {
    return {
      title: 'Login',
    }
  },
  mounted() {
    // If we're not logged in, either start logging in,
    // or wait for login flow to finish before redirecting home.
    if (!this.$auth.loggedIn) {
      // If we're here with a code parameter,
      // let the Auth module finish the PKCE flow without redirecting again.
      // Otherwise, start the Okta login flow.
      if (!this.$route.query.code) {
        this.$auth.loginWith('okta')
      }
      // If we are logged in and don't have a code parameter
    } else if (!this.$route.query.code) {
      // Use $auth.redirect so rewriteRedirects works properly
      // I.e. if we were sent to /login by another page because
      // our token expired, we want to go back to that page, not
      // home. $auth.redirect handles checking where we came from,
      // so we know where to go. Something something cotton-eye Joe.
      this.$auth.redirect('home')
    }
  },
})
</script>

<style></style>
