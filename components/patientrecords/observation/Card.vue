<template>
  <BaseCard class="mb-4 grid grid-cols-3 gap-2 px-4 py-4">
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Type</div>
    <p class="col-span-2 font-medium text-gray-900">{{ item.observationDesc }} {{ item.prePost }}</p>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Value</div>
    <p class="col-span-2">{{ item.observationValue }} {{ item.observationUnits }}</p>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Entered At</div>
    <div v-if="item.enteredAt || item.enteredAtDescription" class="col-span-2">
      <p>{{ item.enteredAt }}</p>
      <p>{{ item.enteredAtDescription }}</p>
    </div>
    <div v-else class="col-span-2">
      <p>Unknown location</p>
    </div>
    <div class="col-span-1 text-sm font-medium uppercase tracking-wider text-gray-500">Entered On</div>
    <p class="col-span-2">
      {{ formatDate(item.observationTime) }}
      <br />
      <BadgePrePost v-if="item.prePost" class="-ml-1 mt-2" :pre-post="item.prePost" />
    </p>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ObservationSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";

import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
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
