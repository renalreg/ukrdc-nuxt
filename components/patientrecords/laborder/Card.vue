<template>
  <BaseCard class="flex items-center justify-between px-4 py-2">
    <div class="flex-1 truncate">
      <h3 class="truncate">
        {{ item.id }}
      </h3>
      <p class="truncate">
        {{
          item.specimenCollectedTime
            ? `Collected ${formatDate(item.specimenCollectedTime, (t = true))}`
            : "No collection time found"
        }}
      </p>
    </div>
    <div class="flex-shrink-0">
      <span class="sr-only">Open options</span>
      <IconChevronRight />
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { LabOrderShortSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
  },
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
