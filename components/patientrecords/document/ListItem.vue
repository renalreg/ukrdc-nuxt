<template>
  <li>
    <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-3 lg:grid-cols-4 gap-2 w-full">
      <!-- File -->
      <div class="col-span-1 lg:col-span-2">
        <div class="truncate">
          <TextL1 class="md:inline truncate">
            {{ item.documentname || item.id }}
          </TextL1>
          <TextL1 class="md:inline truncate">
            {{ item.channel ? `on ${item.channel}` : '' }}
          </TextL1>
        </div>
        <div class="mt-2 flex">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {{ item.filetype || 'text' }}
          </span>
          <TextP class="flex-grow line-clamp-1 ml-2">
            {{ item.filename || `${item.documentname}.txt` }}
          </TextP>
        </div>
      </div>
      <!-- Source  -->
      <div class="col-span-1">
        <TextL1>Entered By</TextL1>
        <TextP class="mt-2">
          {{ item.enteredbydesc || 'Unknown' }}
        </TextP>
      </div>
      <!-- Origin  -->
      <div class="col-span-1">
        <TextP>From {{ item.enteredatcode ? item.enteredatcode : 'Unknown source' }}</TextP>
        <TextP class="mt-2">
          {{ formatDate(item.documenttime) }}
        </TextP>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { PatientDocumentSummary } from '~/interfaces/document'
import { formatDate } from '@/helpers/utils/dateUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientDocumentSummary,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>
