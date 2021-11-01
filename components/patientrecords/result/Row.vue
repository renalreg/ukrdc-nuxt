<template>
  <tr>
    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
      {{ item.serviceId }} ({{ item.serviceIdDescription }})
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ item.value }} {{ item.valueUnits }}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-500 underline truncate">
      <NuxtLink :to="{ query: { order_id: item.orderId } }">
        {{ item.orderId }}
      </NuxtLink>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-500">
      {{ item.observationTime ? formatDate(item.observationTime) : 'No Observation Time' }}
    </td>
  </tr>
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
