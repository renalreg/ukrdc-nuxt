<template>
  <li>
    <div class="flex items-center px-4 py-4 sm:px-6">
      <div class="min-w-0 flex-1 flex items-center">
        <div class="min-w-0 grid grid-cols-3 lg:grid-cols-4 md:gap-4 w-full">
          <!-- IDs and description -->
          <div class="col-span-2">
            <TextL1 v-if="item.person" class="capitalize truncate inline">
              {{ item.person.givenname.toLowerCase() }}
              {{ item.person.surname.toLowerCase() }} →</TextL1
            >
            <TextL1c v-if="item.masterRecord" class="capitalize truncate inline">
              {{ item.masterRecord.givenname.toLowerCase() }}
              {{ item.masterRecord.surname.toLowerCase() }}
            </TextL1c>
            <TextP class="mt-2 truncate">
              {{ item.description }}
            </TextP>
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
              v-if="item.masterRecord"
              class="mt-2"
              :nationalid-type="item.masterRecord.nationalidType"
            />
          </div>
          <!-- Last updated (small and up) -->
          <div class="hidden lg:block">
            <TextP>From {{ facility }}</TextP>
            <TextP class="mt-2">
              {{ formatDate(item.lastUpdated) }}
            </TextP>
          </div>
        </div>
      </div>
      <div>
        <IconChevronRight />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { WorkItemShort } from '@/interfaces/workitem'

export default defineComponent({
  props: {
    item: {
      type: Object as () => WorkItemShort,
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
    return { formatDate, facility }
  },
})
</script>
