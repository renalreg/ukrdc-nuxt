<template>
  <GenericCardFlat class="mb-4 grid grid-cols-3 gap-2 px-4 py-4">
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Type</div>
    <TextP class="col-span-2 font-medium text-gray-900">{{ item.serviceId }} ({{ item.serviceIdDescription }})</TextP>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Value</div>
    <TextP class="col-span-2">{{ item.value }} {{ item.valueUnits }}</TextP>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Order ID</div>
    <div class="col-span-2 truncate">
      <NuxtLink :to="{ query: { order_id: item.orderId } }">
        {{ item.orderId }}
      </NuxtLink>
    </div>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Entered On</div>
    <TextP class="col-span-2">{{ formatDate(item.observationTime) }}</TextP>
    <GenericButton tooltip="Delete this result item" label="Delete this result item" @click="$emit('delete', item)">
      Delete</GenericButton
    >
  </GenericCardFlat>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { formatDate } from "@/helpers/utils/dateUtils";

import { ResultItem } from "~/interfaces/laborder";

export default defineComponent({
  props: {
    item: {
      type: Object as () => ResultItem,
      required: true,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>
