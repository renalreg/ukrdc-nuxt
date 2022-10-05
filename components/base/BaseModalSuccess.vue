<template>
  <BaseModal ref="successModal">
    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
      <!-- Heroicon name: outline/check -->
      <svg
        class="h-6 w-6 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
    <div class="mt-3 text-center sm:mt-5">
      <h3 id="modal-title" class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
      <div class="mt-2">
        <p v-if="message">
          {{ message }}
        </p>
        <slot></slot>
      </div>
    </div>
    <div class="mt-5 sm:mt-6">
      <BaseButton :primary="true" class="w-full px-4 py-2" colour="indigo" @click="confirm()">
        {{ confirmLabel }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseModal from "~/components/base/BaseModal.vue";
import { modalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseButton,
    BaseModal,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
      default: undefined,
    },
    confirmLabel: {
      type: String,
      required: false,
      default: "Go back",
    },
  },

  setup(_, { emit }) {
    const successModal = ref<modalInterface>();

    const visible = computed(() => {
      return successModal.value?.visible || false;
    });

    function show(): void {
      return successModal.value?.show();
    }

    function hide(): void {
      return successModal.value?.hide();
    }

    function toggle(): void {
      return successModal.value?.toggle();
    }

    function confirm(): void {
      emit("confirm");
      hide();
    }

    return {
      successModal,
      visible,
      confirm,
      show,
      hide,
      toggle,
    };
  },
});
</script>
