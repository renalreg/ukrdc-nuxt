<template>
  <li>
    <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-3 lg:grid-cols-4 md:gap-4 w-full">
      <!-- IDs and description -->
      <div class="col-span-2">
        <span
          v-if="item.status == 3"
          class="
            inline-flex
            items-center
            h-5
            px-2.5
            py-0.5
            rounded-full
            text-sm
            font-medium
            bg-green-100
            text-green-800
          "
        >
          Closed
        </span>
        <TextL1 v-if="item.person" class="capitalize truncate inline">
          {{ item.person.givenname.toLowerCase() }}
          {{ item.person.surname.toLowerCase() }} →</TextL1
        >
        <TextL1c v-if="item.masterRecord" class="capitalize truncate inline">
          {{ item.masterRecord.givenname.toLowerCase() }}
          {{ item.masterRecord.surname.toLowerCase() }}
        </TextL1c>
        <TextL1 v-else class="capitalize truncate inline text-red-800"> Missing Record </TextL1>
        <TextP class="mt-2 truncate"> {{ item.type }}: {{ item.description }} </TextP>
      </div>
      <!-- National ID -->
      <div class="text-right sm:text-left">
        <TextP v-if="item.masterRecord">
          {{ item.masterRecord.nationalid.trim() }}
        </TextP>
        <TextP v-else-if="item.person">
          {{ item.person.localid.trim() }}
        </TextP>
        <masterrecordsNationalIdTypeTag
          class="mt-2"
          :nationalid-type="item.masterRecord ? item.masterRecord.nationalidType : 'Unknown Type'"
        />
      </div>
      <!-- Last updated (small and up) -->
      <div class="hidden lg:block">
        <TextP><LinkSendingFacility class="inline" :code="facility" /> via {{ extract }}</TextP>
        <TextP class="mt-2">
          {{ formatDate(item.creationDate) }}
        </TextP>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
import { WorkItem } from '@/interfaces/workitem'

export default defineComponent({
  props: {
    item: {
      type: Object as () => WorkItem,
      required: true,
    },
  },
  setup(props) {
    const facility = computed(() => {
      if (props.item.person?.xrefEntries[0]?.sendingFacility) {
        return props.item.person?.xrefEntries[0]?.sendingFacility
      } else {
        return 'Unknown Facility'
      }
    })
    const extract = computed(() => {
      if (props.item.person?.xrefEntries[0]?.sendingExtract) {
        return props.item.person?.xrefEntries[0]?.sendingExtract
      } else {
        return 'Unknown Extract'
      }
    })
    return { formatDate, facility, extract }
  },
})
</script>
