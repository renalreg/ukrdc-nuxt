<template>
  <li>
    <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
      <!-- Heading -->
      <div class="col-span-5 lg:col-span-3">
        <div class="truncate">
          <TextL1c class="md:inline truncate">
            {{ item.filename || 'No filename found' }}
          </TextL1c>
          <TextL1 class="md:inline truncate">
            {{ item.channel ? `on ${item.channel}` : '' }}
          </TextL1>
        </div>
        <div class="mt-2 flex">
          <ErrorsStatusBadge class="flex-shrink mr-2" :message="item" />
          <TextP class="flex-grow line-clamp-1">
            {{ itemDescription }}
          </TextP>
        </div>
      </div>
      <!-- Recieved  -->
      <div class="col-span-2 lg:col-span-1">
        <TextP>From {{ item.facility }}</TextP>
        <TextP class="mt-2">
          {{ formatDate(item.received) }}
        </TextP>
      </div>
      <!-- Identifiers  -->
      <div class="flex items-center gap-4 col-span-3 lg:col-span-1">
        <GenericButtonRound
          v-if="showPatientFilter"
          :to="{ path: '/messages', query: { nationalid: item.ni } }"
          tooltip="Filter errors by this patient"
          :label="`Filter errors by patient ${item.ni}`"
          ><IconMiniFilter
        /></GenericButtonRound>
        <div class="flex-grow">
          <TextL1>Patient Number</TextL1>
          <TextP class="mt-2">
            {{ item.ni }}
          </TextP>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { Message } from '@/interfaces/messages'

export default defineComponent({
  props: {
    item: {
      type: Object as () => Message,
      required: true,
    },
    showPatientFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {
    const itemDescription = computed(() => {
      if (props.item.msgStatus === 'ERROR') {
        return props.item.error ? props.item.error : 'No error message recorded'
      }
      if (props.item.msgStatus === 'STORED') {
        return 'Stored without error'
      }
      if (props.item.msgStatus === 'RECEIVED') {
        return 'Received without error'
      }
    })
    return { itemDescription, formatDate }
  },
})
</script>
