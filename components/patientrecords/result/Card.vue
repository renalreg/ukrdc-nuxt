<template>
  <BaseCard class="mb-4 grid grid-cols-3 gap-2 px-4 py-4">
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Type</div>
    <p class="col-span-2 font-medium text-gray-900">{{ item.serviceId }} ({{ item.serviceIdDescription }})</p>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Value</div>
    <p class="col-span-2">{{ item.value }} {{ item.valueUnits }}</p>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Order ID</div>
    <div class="col-span-2 truncate">
      <NuxtLink :to="{ query: { order_id: item.orderId } }">
        {{ item.orderId }}
      </NuxtLink>
    </div>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Entered On</div>
    <p class="col-span-2">
      {{ item.observationTime ? formatDate(item.observationTime) : "Unknown time" }}
      <br />
      <BadgePrePost v-if="item.prePost" class="-ml-1 mt-2" :pre-post="item.prePost" />
    </p>
    <BaseButton tooltip="Delete this result item" label="Delete this result item" @click="$emit('delete', item)">
      Delete</BaseButton
    >
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ResultItemSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";

import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
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
