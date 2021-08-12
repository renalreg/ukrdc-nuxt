<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay, show/hide based on modal state. -->
        <GenericBlackout :visible="visible" @click="hide()" />

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal panel, show/hide based on modal state. -->
        <TransitionModal>
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
                  bg-red-100
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  sm:mx-0 sm:h-10 sm:w-10
                "
              >
                <!-- Heroicon name: outline/exclamation -->
                <svg
                  class="text-red-600 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 id="modal-headline" class="text-lg leading-6 font-medium text-gray-900">Delete patient record?</h3>
                <div class="mt-2">
                  <p class="text-gray-500">MESSAGE</p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <GenericButton class="ml-2" colour="red" @click="confirm()"> Delete </GenericButton>
              <GenericButton @click="cancel()"> Cancel </GenericButton>
            </div>
          </div>
        </TransitionModal>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import useModal from '@/mixins/useModal'
import { PatientRecord } from '~/interfaces/patientrecord'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(_, { emit }) {
    const { visible, show, hide, toggle } = useModal()

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
      confirm,
      cancel,
      show,
      hide,
      toggle,
    }
  },
})
</script>
