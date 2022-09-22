<template>
  <tr>
    <GenericTableCell class="font-medium text-gray-900"
      >{{ item.observationCode }} ({{ item.observationDesc }})</GenericTableCell
    >
    <GenericTableCell>{{ item.observationValue }} {{ item.observationUnits }}</GenericTableCell>
    <GenericTableCell>
      <p v-if="item.enteredAt || item.enteredAtDescription">{{ item.enteredAt }} / {{ item.enteredAtDescription }}</p>
      <p v-else>Unknown location</p>
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
import { defineComponent } from "@nuxtjs/composition-api";
import { ObservationSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";

export default defineComponent({
  props: {
    item: {
      type: Object as () => ObservationSchema,
      required: true,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>

<style scoped></style>
