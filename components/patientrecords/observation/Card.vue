<template>
  <GenericCardFlat class="grid grid-cols-3 gap-2 mb-4 px-4 py-4">
    <div
      class="
        text-xs
        font-medium
        text-gray-500
        uppercase
        tracking-wider
        col-span-1
      "
    >
      Type
    </div>
    <TextP class="col-span-2 font-medium text-gray-900"
      >{{ item.observationDesc }} {{ item.prePost }}</TextP
    >
    <div
      class="
        text-xs
        font-medium
        text-gray-500
        uppercase
        tracking-wider
        col-span-1
      "
    >
      Value
    </div>
    <TextP class="col-span-2"
      >{{ item.observationValue }} {{ item.observationUnits }}</TextP
    >
    <div
      class="
        text-xs
        font-medium
        text-gray-500
        uppercase
        tracking-wider
        col-span-1
      "
    >
      Entered At
    </div>
    <div class="col-span-2">
      <TextP>{{ item.enteredAt }}</TextP>
      <TextP>{{ item.enteredAtDescription }}</TextP>
    </div>
    <div
      class="
        text-xs
        font-medium
        text-gray-500
        uppercase
        tracking-wider
        col-span-1
      "
    >
      Entered On
    </div>
    <TextP class="col-span-2">{{ formatDate(item.observationTime) }}</TextP>
  </GenericCardFlat>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'

import { Observation } from '@/interfaces/observation'

export default defineComponent({
  props: {
    item: {
      type: Object as () => Observation,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>

<style scoped></style>
