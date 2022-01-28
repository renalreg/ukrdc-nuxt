<template>
  <tr class="group">
    <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
      {{ item.serviceId }} ({{ item.serviceIdDescription }})
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-gray-500">{{ item.value }} {{ item.valueUnits }}</td>
    <td class="flex items-center gap-2 whitespace-nowrap px-6 py-4">
      <GenericButtonRound
        class="opacity-0 group-hover:opacity-100"
        tooltip="Filter by this lab order"
        label="Filter by this lab order"
        :to="{ query: { order_id: item.orderId } }"
        ><IconMiniFilter
      /></GenericButtonRound>
      <div class="truncate text-gray-500">
        {{ item.orderId }}
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-gray-500">
      {{ item.observationTime ? formatDate(item.observationTime) : "No Observation Time" }}
    </td>
    <td class="text-gray-500">
      <GenericButtonRound
        class="opacity-0 group-hover:opacity-100"
        tooltip="Delete this result item"
        label="Delete this result item"
        @click="$emit('delete', item)"
        ><IconMiniTrash
      /></GenericButtonRound>
    </td>
  </tr>
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
