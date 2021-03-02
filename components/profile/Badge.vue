<template>
  <NuxtLink
    to="/profile"
    class="flex-shrink-0 group block"
    @click.native="$emit('click')"
  >
    <div class="flex items-center" :class="{ 'flex-row-reverse': rightToLeft }">
      <div>
        <img
          v-if="$auth.loggedIn"
          class="inline-block h-10 w-10 rounded-full"
          :src="$auth.user.picture"
          alt=""
        />
        <span
          v-else
          class="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100"
        >
          <svg
            class="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </span>
      </div>
      <div :class="rightToLeft ? 'mr-3' : 'ml-3'">
        <p
          :class="{ 'text-right': rightToLeft }"
          class="text-base font-medium text-gray-700 group-hover:text-gray-900"
        >
          {{ $auth.loggedIn ? this.$auth.user.nickname : 'Signed out' }}
        </p>
        <p
          :class="{ 'text-right': rightToLeft }"
          class="text-sm font-medium text-gray-500 group-hover:text-gray-700"
        >
          Manage account
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    rightToLeft: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})
</script>

<style></style>
