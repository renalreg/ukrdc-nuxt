<template>
  <BaseModal ref="confirmModal">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
        :class="danger ? 'bg-red-100' : 'bg-indigo-100'"
      >
        <!-- Heroicon name: outline/exclamation -->
        <svg
          class="h-6 w-6"
          :class="danger ? 'text-red-600' : 'text-indigo-600'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="modalIcon" />
        </svg>
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 id="modal-headline" class="text-lg font-medium leading-6 text-gray-900">
          {{ title }}
        </h3>
        <div class="mt-2">
          <p v-if="message">
            {{ message }}
          </p>
          <slot />
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <BaseButton :primary="true" class="ml-2" :colour="danger ? 'red' : 'indigo'" @click="confirm()">
        {{ confirmLabel }}
      </BaseButton>
      <BaseButton @click="cancel()">
        {{ cancelLabel }}
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
      default: "Confirm",
    },
    cancelLabel: {
      type: String,
      required: false,
      default: "Cancel",
    },
    danger: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },

  setup(props, { emit }) {
    const confirmModal = ref<modalInterface>();

    const visible = computed(() => {
      return confirmModal.value?.visible || false;
    });

    function show(): void {
      return confirmModal.value?.show();
    }

    function hide(): void {
      return confirmModal.value?.hide();
    }

    function toggle(): void {
      return confirmModal.value?.toggle();
    }

    const modalIcon = computed(() => {
      if (props.icon !== null) {
        return props.icon;
      } else if (props.danger) {
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
      } else {
        return "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      }
    });

    function confirm(): void {
      emit("confirm");
      hide();
    }
    function cancel(): void {
      emit("cancel");
      hide();
    }

    return {
      confirmModal,
      visible,
      modalIcon,
      confirm,
      cancel,
      show,
      hide,
      toggle,
    };
  },
});
</script>
