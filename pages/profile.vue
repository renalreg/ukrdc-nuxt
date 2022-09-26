<template>
  <div>
    <div class="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
      <div
        v-if="isAuthenticated"
        class="max-w-3xl lg:flex lg:max-w-7xl lg:items-center lg:justify-between lg:space-x-5"
      >
        <div class="mb-4 flex items-center space-x-5">
          <div class="flex-shrink-0">
            <div class="relative">
              <span
                class="inline-block h-16 w-16 overflow-hidden rounded-full"
                :class="isAuthenticated ? 'bg-indigo-100' : 'bg-gray-100'"
              >
                <svg
                  class="h-full w-full"
                  :class="isAuthenticated ? 'text-indigo-300' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
            </div>
          </div>
          <div v-if="user">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ user.name }}
            </h1>
            <p class="font-medium text-gray-500">
              {{ user.email }}
              {{ user.email_verified ? "(Verified)" : "(Unverified)" }}
            </p>
          </div>
          <div v-else>
            <BaseSkeleText class="mb-2 h-8 w-24" />
            <BaseSkeleText class="h-6 w-32" />
          </div>
        </div>
        <div
          class="justify-stretch mb-8 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse lg:mt-0 lg:flex-row lg:space-x-3"
        >
          <a
            :href="$config.manageAccountUrl"
            target="blank"
            type="button"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-center font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >Manage Account</a
          >
          <BaseButton @click="$okta.signOutAuto()"> Sign out </BaseButton>
        </div>
      </div>
      <div class="mb-4">
        <h2 class="mb-4">Permissions</h2>
        <div v-for="group in perms" :key="group" class="inline">
          <span
            class="mr-2 mb-2 inline-flex items-center rounded-full px-3 py-0.5 font-medium"
            :class="classesForPermissions(group)"
          >
            {{ group }}
          </span>
        </div>
      </div>
      <div v-if="preferences" class="mb-4">
        <h2 class="mb-4">Preferences</h2>
        <div class="mb-4">
          <h3 class="mb-2">Search</h3>
          <FormCheckbox
            v-model="preferences.searchShowUkrdc"
            label="Include internal UKRDC records in search results by default"
          />
        </div>
        <BaseButton colour="indigo" :primary="true" @click="submitPreferences">Save</BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from "@nuxtjs/composition-api";
import { UserPreferences } from "@ukkidney/ukrdc-axios-ts";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";

export default defineComponent({
  components: {
    BaseButton,
    BaseSkeleText,
  },
  setup() {
    const { $okta } = useContext();
    const { getPermissions } = usePermissions();
    const { systemInfoApi } = useApi();

    // User info
    const isAuthenticated = ref(false);
    const user = ref();

    onMounted(async () => {
      isAuthenticated.value = await $okta.isAuthenticated();
      if (isAuthenticated.value) {
        user.value = await $okta.getUser();
      }
    });

    // Permissions

    const perms = computed(() => getPermissions());

    function classesForPermissions(permission: string): string[] {
      if (permission.includes("read")) {
        return ["bg-green-100", "text-green-800"];
      } else if (permission.includes("write")) {
        return ["bg-red-100", "text-red-800"];
      } else {
        return ["bg-indigo-100", "text-indigo-800"];
      }
    }

    // Preferences

    const preferences = ref<UserPreferences>();

    onMounted(() => {
      systemInfoApi.getSystemUserPreferences().then((response) => {
        preferences.value = response.data;
      });
    });

    async function submitPreferences() {
      if (preferences.value) {
        await systemInfoApi.putUpdateSystemUserPreferences({
          userPreferencesRequest: preferences.value,
        });
      }
    }

    return {
      user,
      isAuthenticated,
      perms,
      preferences,
      submitPreferences,
      classesForPermissions,
    };
  },
  head: {
    title: "Profile",
  },
});
</script>

<style></style>
