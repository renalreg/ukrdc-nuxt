<template>
  <tr>
    <BaseTableCell class="font-medium text-gray-900"
      >{{ item.observationCode }} ({{ item.observationDesc }})</BaseTableCell
    >
    <BaseTableCell>{{ item.observationValue }} {{ item.observationUnits }}</BaseTableCell>
    <BaseTableCell>
      <p v-if="item.enteredAt || item.enteredAtDescription">{{ item.enteredAt }} / {{ item.enteredAtDescription }}</p>
      <p v-else>Unknown location</p>
    </BaseTableCell>
    <BaseTableCell>
      {{ formatDate(item.observationTime) }}
    </BaseTableCell>
    <td class="whitespace-nowrap px-4 py-4 text-gray-500">
      <BadgePrePost v-if="item.prePost" :pre-post="item.prePost" />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ObservationSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseTableCell from "~/components/base/BaseTableCell.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseTableCell,
  },
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
