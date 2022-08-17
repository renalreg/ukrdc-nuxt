<template>
  <tr>
    <GenericTableCell class="font-medium text-gray-900">{{ item.observationDesc }}</GenericTableCell>
    <GenericTableCell>{{ item.observationValue }} {{ item.observationUnits }}</GenericTableCell>
    <GenericTableCell>
      <p>{{ item.enteredAt }} / {{ item.enteredAtDescription }}</p>
    </GenericTableCell>
    <GenericTableCell>
      {{ formatDate(item.observationTime) }}
    </GenericTableCell>
    <td class="whitespace-nowrap px-4 py-4 text-gray-500">
      <BadgePrePost v-if="item.prePost" :pre-post="item.prePost" />
    </td>
  </tr>
</template>

<script lang="ts">
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
