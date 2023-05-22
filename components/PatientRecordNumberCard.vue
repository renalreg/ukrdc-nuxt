<template>
  <BaseCard class="flex">
    <div class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md font-medium text-white" :class="[organization == 'UKKA' ? 'bg-red-700' : 'bg-indigo-600']">
      {{ numbertype }}
    </div>
    <div class="flex flex-1 items-center justify-between truncate">
      <div class="flex-1 truncate px-4 py-2">
        <b class="sensitive truncate">
          {{ number }}
        </b>
        <p class="sensitive">{{ organization }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import BaseCard from "~/components/base/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    number: {
      type: String,
      required: true,
    },
    numbertype: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
  },
});
</script>
