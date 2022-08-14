<template>
  <GenericCardMini class="flex items-center justify-between px-4 py-2">
    <div class="flex-1 truncate">
      <TextH3 class="truncate">
        {{ item.id }}
      </TextH3>
      <TextP class="truncate">
        {{
          item.specimenCollectedTime
            ? `Collected ${formatDate(item.specimenCollectedTime, (t = true))}`
            : "No collection time found"
        }}
      </TextP>
    </div>
    <div class="flex-shrink-0">
      <span class="sr-only">Open options</span>
      <IconChevronRight />
    </div>
  </GenericCardMini>
</template>

<script lang="ts">
import { LabOrderShortSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";

export default defineComponent({
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
