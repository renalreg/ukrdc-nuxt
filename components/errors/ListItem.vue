<template>
  <li>
    <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-3 sm:grid-cols-5 gap-2 w-full">
      <!-- Heading -->
      <div class="col-span-3">
        <TextL1c class="truncate">
          {{ item.filename || 'No filename found' }}
        </TextL1c>
        <TextP class="mt-2 line-clamp-2">
          {{ item.error ? item.error : 'No error message recorded' }}
        </TextP>
      </div>
      <!-- Identifiers  -->
      <div class="flex items-center gap-4 col-span-1">
        <GenericButtonRound
          :to="{ path: '/errors', query: { nationalid: item.ni } }"
          tooltip="Filter errors by this patient"
          ><IconMiniFilter
        /></GenericButtonRound>
        <div class="flex-grow">
          <TextL1>Patient Number</TextL1>
          <TextP class="mt-2">
            {{ item.ni }}
          </TextP>
        </div>
      </div>

      <!-- Recieved  -->
      <div class="col-span-2 sm:col-span-1">
        <TextP>From {{ item.facility }}</TextP>
        <TextP class="mt-2">
          {{ formatDate(item.received) }}
        </TextP>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { Message } from '@/interfaces/errors'

export default defineComponent({
  props: {
    item: {
      type: Object as () => Message,
      required: true,
    },
  },
  setup() {
    return { formatDate }
  },
})
</script>
