<template>
  <client-only>
    <div class="mb-4 flex w-full">
      <v-date-picker
        class="w-full"
        :value="value"
        :model-config="modelConfig"
        :is24hr="true"
        :popover="{ visibility: 'click' }"
        mode="dateTime"
        color="indigo"
        is-range
        v-on="$listeners"
      >
        <template #default="{ inputValue, inputEvents }">
          <div class="flex flex-col sm:flex-row justify-start items-center h-full">
            <div class="relative flex-grow w-full h-full">
              <svg
                class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <input :class="textBoxClasses" :value="inputValue.start" v-on="inputEvents.start" />
            </div>
            <span class="flex-shrink-0 m-2">
              <svg class="w-4 h-4 stroke-current text-gray-600" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div class="relative flex-grow w-full h-full">
              <svg
                class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <input :class="textBoxClasses" :value="inputValue.end" v-on="inputEvents.end" />
            </div>
          </div>
        </template>
      </v-date-picker>
      <GenericButtonTertiary class="ml-2" @click="$emit('input', { since: null, until: null })"
        >Clear</GenericButtonTertiary
      >
    </div>
  </client-only>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { DateRange } from '@/utilities/dateUtils'

export default defineComponent({
  props: {
    value: {
      type: Object as () => DateRange,
      required: true,
    },
    modelConfig: {
      type: Object,
      required: false,
      default: () => ({
        start: {
          type: 'string',
          mask: 'iso',
        },
        end: {
          type: 'string',
          mask: 'iso',
        },
      }),
    },
  },
  setup() {
    const textBoxClasses =
      'flex-grow pl-8 pr-2 py-1 w-full h-full bg-white border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'

    return { textBoxClasses }
  },
})
</script>

<style scoped>
::v-deep select {
  background-image: none;
}
</style>
