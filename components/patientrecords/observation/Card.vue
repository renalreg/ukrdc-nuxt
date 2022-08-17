<template>
  <GenericCardFlat class="mb-4 grid grid-cols-3 gap-2 px-4 py-4">
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Type</div>
    <TextP class="col-span-2 font-medium text-gray-900">{{ item.observationDesc }} {{ item.prePost }}</TextP>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Value</div>
    <TextP class="col-span-2">{{ item.observationValue }} {{ item.observationUnits }}</TextP>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Entered At</div>
    <div class="col-span-2">
      <TextP>{{ item.enteredAt }}</TextP>
      <TextP>{{ item.enteredAtDescription }}</TextP>
    </div>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Entered On</div>
    <TextP class="col-span-2">
      {{ formatDate(item.observationTime) }}
      <br />
      <BadgePrePost v-if="item.prePost" class="-ml-1 mt-2" :pre-post="item.prePost" />
    </TextP>
  </GenericCardFlat>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { formatDate } from "@/helpers/utils/dateUtils";

import { Observation } from "@/interfaces/observation";

export default defineComponent({
  props: {
    item: {
      type: Object as () => Observation,
      required: true,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>

<style scoped></style>
