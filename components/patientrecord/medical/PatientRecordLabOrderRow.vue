<template>
  <tr
    class="group cursor-pointer hover:bg-gray-50"
    @click="$router.push({ path: `/patientrecords/${item.pid}/medical/results`, query: { order_id: item.id } })"
  >
    <td class="font-medium">
      {{ item.id }}
    </td>
    <td>
      {{
        item.specimenCollectedTime
          ? `Collected ${formatDate(item.specimenCollectedTime, true)}`
          : "No collection time found"
      }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { LabOrderShortSchema } from "@ukkidney/ukrdc-axios-ts";

import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {},
  props: {
    item: {
      type: Object as () => LabOrderShortSchema,
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
