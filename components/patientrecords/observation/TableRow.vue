<template>
  <tr>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {{ item.observationDesc }} {{ item.prePost }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ item.observationValue }} {{ item.observationUnits }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <p>{{ item.enteredAt }}</p>
      <p>{{ item.enteredAtDescription }}</p>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ formatDate(item.observationTime) }}
    </td>
  </tr>
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
