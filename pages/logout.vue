<template>
  <div class="justify-center text-center">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Signing out...</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  auth: false,

  setup() {
    const { $auth } = useContext()

    onMounted(() => {
      $auth.reset()
      $auth.redirect('home')
    })
  }, // Override auth middleware. We handle redirects here ourselves in mounted()
  head: {
    title: 'Login',
  },
})
</script>
