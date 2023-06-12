<template>
  <tr class="group">
    <td class="font-medium">{{ item.serviceId }} ({{ item.serviceIdDescription }})</td>
    <td>{{ item.value }} {{ item.valueUnits }}</td>
    <td class="flex items-center gap-2">
      <div class="flex-grow truncate text-gray-500">
        {{ item.orderId }}
      </div>
    </td>
    <td>
      {{ item.observationTime ? formatDate(item.observationTime) : "No Observation Time" }}
    </td>
    <td>
      <BadgePrePost v-if="item.prePost" :pre-post="item.prePost" />
    </td>
    <td class="flex gap-2 text-gray-500">
      <BaseButton
        class="opacity-0 group-hover:opacity-100"
        :round="true"
        :tight="true"
        tooltip="Filter by this lab order"
        label="Filter by this lab order"
        :to="{ query: { order_id: item.orderId } }"
        ><IconFunnel />
      </BaseButton>
      <BaseButton
        class="opacity-0 group-hover:opacity-100"
        :round="true"
        :tight="true"
        tooltip="Delete this result item"
        label="Delete this result item"
        @click="$emit('delete', item)"
        ><IconTrash />
      </BaseButton>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ResultItemSchema } from "@ukkidney/ukrdc-axios-ts";

import BadgePrePost from "~/components/BadgePrePost.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import IconFunnel from "~/components/icons/hero/20/solid/IconFunnel.vue";
import IconTrash from "~/components/icons/hero/20/solid/IconTrash.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseButton,
    IconFunnel,
    IconTrash,
    BadgePrePost,
  },
  props: {
    item: {
      type: Object as () => ResultItemSchema,
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
