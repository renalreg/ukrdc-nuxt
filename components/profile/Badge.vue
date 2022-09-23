<template>
  <div v-click-away="closeMenu" class="relative w-full justify-self-end">
    <BaseButtonSlot
      label="Manage profile"
      class="group block w-full rounded-md px-4 py-2 hover:bg-gray-100"
      @click="showMenu = !showMenu"
    >
      <div class="flex items-center gap-4" :class="{ 'flex-row-reverse': rightToLeft }">
        <div class="h-10 w-10">
          <span
            class="inline-block h-10 w-10 overflow-hidden rounded-full"
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
        </div>
        <div class="flex-1">
          <p
            :class="rightToLeft ? 'text-right' : 'text-left'"
            class="text-base font-medium text-gray-700 group-hover:text-gray-900"
          >
            {{ displayName }}
          </p>
        </div>
        <div v-show="!rightToLeft" class="flex-0">
          <svg class="h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </BaseButtonSlot>

    <GenericMenu
      v-if="isAuthenticated"
      class="z-10 w-full"
      :class="topToBottom ? 'top-16 right-0' : 'bottom-16 left-0 mb-1'"
      :show="showMenu"
    >
      <GenericMenuItem to="/profile"> Profile and Settings </GenericMenuItem>
      <GenericMenuItem :href="$config.manageAccountUrl" target="blank"> Manage Account </GenericMenuItem>
      <GenericMenuDivider />
      <GenericMenuItem to="/system"> Support </GenericMenuItem>
      <GenericMenuDivider />
      <GenericMenuItem to="/tasks"> Background Tasks </GenericMenuItem>
      <GenericMenuDivider />
      <GenericMenuItem @click="$okta.signOutAuto()"> Logout </GenericMenuItem>
    </GenericMenu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext } from "@nuxtjs/composition-api";
import BaseButtonSlot from "@/components/base/BaseButtonSlot.vue";
import useAuth from "~/composables/useAuth";

export default defineComponent({
  components: {
    BaseButtonSlot,
  },
  props: {
    rightToLeft: {
      type: Boolean,
      required: false,
      default: false,
    },
    topToBottom: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const { $okta } = useContext();
    const { idToken } = useAuth();

    // Menu
    const showMenu = ref(false);
    function closeMenu() {
      showMenu.value = false;
    }

    // User info
    const isAuthenticated = ref(false);
    const displayName = computed(() => {
      if (idToken.value) {
        return idToken.value.payload.name;
      }
      return "Signed Out";
    });

    onMounted(async () => {
      isAuthenticated.value = await $okta.isAuthenticated();
    });

    return {
      isAuthenticated,
      displayName,
      showMenu,
      closeMenu,
    };
  },
});
</script>

<style></style>
