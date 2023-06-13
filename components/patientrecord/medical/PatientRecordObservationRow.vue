<template>
  <tr>
    <td class="font-medium text-gray-900">{{ item.observationCode }} ({{ item.observationDesc }})</td>
    <td>{{ item.observationValue }} {{ item.observationUnits }}</td>
    <td>
      <p v-if="item.enteredAt || item.enteredAtDescription">{{ item.enteredAt }} / {{ item.enteredAtDescription }}</p>
      <p v-else>Unknown location</p>
    </td>
    <td>
      {{ formatDate(item.observationTime) }}
    </td>
    <td>
      <BadgePrePost v-if="item.prePost" :pre-post="item.prePost" />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ObservationSchema } from "@ukkidney/ukrdc-axios-ts";

import BadgePrePost from "~/components/BadgePrePost.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BadgePrePost,
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

<style scoped lang="postcss">
td {
  @apply whitespace-nowrap px-6 py-4;
}
</style>
