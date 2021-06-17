<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay, show/hide based on modal state. -->
        <transition
          enter-active-class="ease-out"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0 scale-90"
        >
          <div v-if="visible" class="fixed inset-0 transition-opacity" aria-hidden="true" @click="hide()">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
        </transition>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal panel, show/hide based on modal state. -->
        <transition
          enter-active-class="ease-out"
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-show="visible"
            class="
              inline-block
              align-bottom
              bg-white
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="sm:flex sm:items-start">
              <div
                class="
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  sm:mx-0 sm:h-10 sm:w-10
                "
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
                <h3 id="modal-headline" class="text-lg leading-6 font-medium text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <GenericButtonPrimary class="ml-2" :colour="danger ? 'red' : 'indigo'" @click="confirm()">
                {{ confirmLabel }}
              </GenericButtonPrimary>
              <GenericButton @click="cancel()">
                {{ cancelLabel }}
              </GenericButton>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import useModal from '@/mixins/useModal'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmLabel: {
      type: String,
      required: false,
      default: 'Confirm',
    },
    cancelLabel: {
      type: String,
      required: false,
      default: 'Cancel',
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
    const { visible, show, hide, toggle } = useModal()

    const modalIcon = computed(() => {
      if (props.icon !== null) {
        return props.icon
      } else if (props.danger) {
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      } else {
        return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    })

    function confirm(): void {
      emit('confirm')
      hide()
    }
    function cancel(): void {
      emit('cancel')
      hide()
    }

    return {
      visible,
      modalIcon,
      confirm,
      cancel,
      show,
      hide,
      toggle,
    }
  },
})
</script>
