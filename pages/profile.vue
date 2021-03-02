<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div
        v-if="$auth.loggedIn"
        class="max-w-3xl md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl"
      >
        <div class="flex items-center space-x-5">
          <div class="flex-shrink-0">
            <div class="relative">
              <img
                class="h-16 w-16 rounded-full"
                :src="$auth.user.picture"
                alt=""
              />
              <span
                class="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              ></span>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ $auth.user.nickname }}
            </h1>
            <p class="text-sm font-medium text-gray-500">
              {{ $auth.user.email }}
              {{ $auth.user.email_verified ? '(Verified)' : '(Unverified)' }}
            </p>
          </div>
        </div>
        <div
          class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            @click="$auth.logout()"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Profile',
    }
  },
})
</script>

<style></style>
