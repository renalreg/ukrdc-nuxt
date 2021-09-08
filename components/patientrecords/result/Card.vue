<template>
  <GenericCardFlat class="grid grid-cols-3 gap-2 mb-4 px-4 py-4">
    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Type</div>
    <TextP class="col-span-2 font-medium text-gray-900">{{ item.serviceId }} ({{ item.serviceIdDescription }})</TextP>
    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Value</div>
    <TextP class="col-span-2">{{ item.value }} {{ item.valueUnits }}</TextP>
    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Order ID</div>
    <div class="col-span-2 truncate">
      <NuxtLink :to="{ query: { order_id: item.orderId } }">
        {{ item.orderId }}
      </NuxtLink>
    </div>
    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider col-span-1">Entered On</div>
    <TextP class="col-span-2">{{ formatDate(item.observationTime) }}</TextP>
  </GenericCardFlat>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'

import { ResultItem } from '~/interfaces/laborder'

export default defineComponent({
  props: {
    item: {
      type: Object as () => ResultItem,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>
