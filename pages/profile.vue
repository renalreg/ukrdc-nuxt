<template>
  <div>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <div v-if="$auth.loggedIn" class="max-w-3xl lg:flex lg:items-center lg:justify-between lg:space-x-5 lg:max-w-7xl">
        <div class="flex items-center space-x-5 mb-4">
          <div class="flex-shrink-0">
            <div class="relative">
              <img v-if="$auth.user.picture" class="h-16 w-16 rounded-full" :src="$auth.user.picture" alt="" />
              <span
                v-else
                class="inline-block h-16 w-16 rounded-full overflow-hidden"
                :class="$auth.loggedIn ? 'bg-indigo-100' : 'bg-gray-100'"
              >
                <svg
                  class="h-full w-full"
                  :class="$auth.loggedIn ? 'text-indigo-300' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              <span class="absolute inset-0 shadow-inner rounded-full" aria-hidden="true"></span>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ $auth.user.name }}
            </h1>
            <p class="font-medium text-gray-500">
              {{ $auth.user.email }}
              {{ $auth.user.email_verified ? '(Verified)' : '(Unverified)' }}
            </p>
          </div>
        </div>
        <div
          class="
            mb-8
            flex flex-col-reverse
            justify-stretch
            space-y-4 space-y-reverse
            sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3
            lg:mt-0 lg:flex-row lg:space-x-3
          "
        >
          <a
            :href="$config.oktaDomain + '/app/UserHome'"
            target="blank"
            type="button"
            class="
              text-center
              px-3
              py-2
              border border-gray-300
              shadow-sm
              font-medium
              rounded-md
              text-gray-700
              bg-white
              hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
            >Manage Account</a
          >
          <GenericButton @click="logout()"> Sign out </GenericButton>
        </div>
      </div>
      <div class="mb-4">
        <TextH3 class="mb-2">Permissions</TextH3>
        <div v-for="group in perms" :key="group" class="inline">
          <span
            class="inline-flex items-center px-3 py-0.5 rounded-full font-medium mr-2 mb-2"
            :class="classesForScope(group)"
          >
            {{ group }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import usePermissions from '~/helpers/usePermissions'

export default defineComponent({
  setup() {
    const { $auth } = useContext()
    const { getPermissions } = usePermissions()

    const perms = computed(() => getPermissions())

    function logout(): void {
      $auth.logout()
    }

    function classesForScope(scope: string): string[] {
      if (scope.includes('read')) {
        return ['bg-green-100', 'text-green-800']
      } else if (scope.includes('write')) {
        return ['bg-red-100', 'text-red-800']
      } else {
        return ['bg-indigo-100', 'text-indigo-800']
      }
    }

    return {
      perms,
      logout,
      classesForScope,
    }
  },
  head: {
    title: 'Profile',
  },
})
</script>

<style></style>
