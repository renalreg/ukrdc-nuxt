<template>
  <GenericCardMini class="px-4 py-2 flex items-center justify-between">
    <div class="flex-1 truncate">
      <TextH3 class="truncate">
        {{ item.id }}
      </TextH3>
      <TextP class="truncate">
        {{
          item.specimenCollectedTime
            ? `Collected ${formatDate(item.specimenCollectedTime, (t = true))}`
            : 'No collection time found'
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
import { defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'

import { LabOrderShort } from '~/interfaces/laborder'

export default defineComponent({
  props: {
    item: {
      type: Object as () => LabOrderShort,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>
