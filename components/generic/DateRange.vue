<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <div class="flex gap-2 flex-none">
      <GenericButtonMini :colour="lastNDays === 7 ? 'indigo-outline' : 'white'" @click="setLastNDays(7)">
        Last 7 days
      </GenericButtonMini>
      <GenericButtonMini :colour="lastNDays === 30 ? 'indigo-outline' : 'white'" @click="setLastNDays(30)">
        Last 30 days
      </GenericButtonMini>
      <GenericButtonMini :colour="lastNDays === 365 ? 'indigo-outline' : 'white'" @click="setLastNDays(365)">
        Last year
      </GenericButtonMini>
      <GenericButtonMini :colour="lastNDays === 3650 ? 'indigo-outline' : 'white'" @click="setLastNDays(3650)">
        Last 10 years
      </GenericButtonMini>
      <GenericButtonMini :colour="showCustom ? 'indigo-outline' : 'white'" @click="showCustom = true">
        Custom
      </GenericButtonMini>
      <GenericButtonMini colour="red-outline" @click="clear()"> Clear </GenericButtonMini>
    </div>
    <div v-show="showCustom" class="flex w-full h-8 flex-1">
      <v-date-picker
        class="w-full"
        :value="value"
        :model-config="modelConfig"
        :is24hr="true"
        :popover="{ visibility: 'hidden', placement: 'bottom' }"
        :step="1"
        mode="dateTime"
        color="indigo"
        is-range
        v-on="$listeners"
      >
        <template #default="{ inputValue, inputEvents, showPopover }">
          <div class="flex flex-row justify-start items-center h-full" @click="showPopover">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'

import { DateRange, nowString } from '@/helpers/utils/dateUtils'

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
  setup(props, { emit }) {
    const showCustom = ref(false)

    const textBoxClasses =
      'flex-grow pl-8 pr-2 py-1 w-full h-full bg-white border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 truncate'

    function clear(): void {
      showCustom.value = false
      emit('input', { start: null, end: null })
    }

    const lastNDays = computed((): number | null => {
      if (showCustom.value) {
        return null
      }
      if (props.value.start && props.value.end) {
        return Math.round((Date.parse(props.value.end) - Date.parse(props.value.start)) / (1000 * 3600 * 24))
      }
      return null
    })

    function setLastNDays(daysAgo: number): void {
      showCustom.value = false
      const newRange: DateRange = { start: nowString(-daysAgo), end: nowString(0) }
      emit('input', newRange)
    }

    return { showCustom, textBoxClasses, lastNDays, setLastNDays, clear }
  },
})
</script>

<style scoped>
::v-deep select {
  background-image: none;
}
</style>
