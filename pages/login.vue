<template>
  <div class="justify-center text-center">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Redirecting to login...</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted } from '@nuxtjs/composition-api'

import useAuth from '~/helpers/useAuth'

export default defineComponent({
  // Override auth middleware. We handle redirects here ourselves in mounted()
  auth: false,

  setup() {
    const { oktaAuth, signIn, isLoginRedirect, handleLoginRedirect } = useAuth()

    onBeforeMount(() => {
      if (isLoginRedirect()) {
        handleLoginRedirect()
      }
    })

    onMounted(() => {
      if (!isLoginRedirect()) {
        signIn()
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
