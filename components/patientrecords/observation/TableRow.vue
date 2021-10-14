<template>
  <tr>
    <GenericTableCell class="font-medium text-gray-900">{{ item.observationDesc }} {{ item.prePost }}</GenericTableCell>
    <GenericTableCell>{{ item.observationValue }} {{ item.observationUnits }}</GenericTableCell>
    <GenericTableCell>
      <p>{{ item.enteredAt }} / {{ item.enteredAtDescription }}</p>
    </GenericTableCell>
    <GenericTableCell>
      {{ formatDate(item.observationTime) }}
    </GenericTableCell>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
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
