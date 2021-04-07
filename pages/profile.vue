<template>
  <div>
    <ModalConfirm
      ref="resetPasswordAlert"
      title="Reset your password"
      message="Are you sure you want to reset your password? You will receieve an email shortly to start the reset."
      icon="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      @confirm="resetPasswordAuth0()"
    />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <div
        v-if="$auth.loggedIn"
        class="max-w-3xl lg:flex lg:items-center lg:justify-between lg:space-x-5 lg:max-w-7xl"
      >
        <div class="flex items-center space-x-5 mb-4">
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
          class="mb-8 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 lg:mt-0 lg:flex-row lg:space-x-3"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="showResetPasswordAlert()"
          >
            Reset Password
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            @click="$auth.logout()"
          >
            Sign out
          </button>
        </div>
        <div>
          <h3 class="text-sm leading-6 font-medium text-gray-900 mb-2">
            Permissions
          </h3>
          <div v-for="scope in $auth.user.scope" :key="scope" class="inline">
            <span
              v-if="showScopeBadge(scope)"
              class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium capitalize mr-2 mb-2"
              :class="classesForScope(scope)"
            >
              {{ renderScope(scope) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface ResetPasswordPayload {
  // eslint-disable-next-line camelcase
  client_id: string
  email: string
  connection: string
}

export default Vue.extend({
  data() {
    return {
      auth: this.$auth,
    }
  },
  head() {
    return {
      title: 'Profile',
    }
  },

  methods: {
    showResetPasswordAlert(): void {
      this.$refs.resetPasswordAlert.show()
    },
    resetPasswordAuth0(): void {
      const domain: string = this.$auth.strategies.auth0.options.domain
      const clientId: string = this.$auth.strategies.auth0.options.clientId
      const userEmail: string = this.$auth.user.email
      const url: string = `https://${domain}/dbconnections/change_password`
      const payload: ResetPasswordPayload = {
        client_id: clientId,
        email: userEmail,
        connection: 'Username-Password-Authentication',
      }
      this.$axios.$post(url, payload).then((res: string) => {
        console.log(res)
      })
    },
    classesForScope(scope: string): string[] {
      if (scope.startsWith('read')) {
        return ['bg-green-100', 'text-green-800']
      } else if (scope.startsWith('write')) {
        return ['bg-red-100', 'text-red-800']
      } else {
        return ['bg-indigo-100', 'text-indigo-800']
      }
    },
    showScopeBadge(scope: string): boolean {
      if (scope.startsWith('read') || scope.startsWith('write')) {
        return true
      }
      return false
    },
    renderScope(scope: string): string {
      const split = scope.split(':')
      return split.join(' ')
    },
  },
})
</script>

<style></style>
