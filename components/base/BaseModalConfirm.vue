<template>
  <BaseModal ref="confirmModal">
    <div
      class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
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
    <div class="mt-3 text-center sm:mt-5">
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
    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
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
import { ModalInterface } from "~/interfaces/modal";

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
    const confirmModal = ref<ModalInterface>();

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
        return "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z";
      } else {
        return "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z";
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
