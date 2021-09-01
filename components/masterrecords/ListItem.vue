<template>
  <li>
    <!-- Content container -->
    <div
      class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-3 md:gap-4 w-full"
      :class="showRecordId ? 'lg:grid-cols-4' : 'col-span-2'"
    >
      <!-- Name, DoB, gender -->
      <div>
        <TextL1c class="capitalize truncate">
          {{ item.givenname.toLowerCase() }}
          {{ item.surname.toLowerCase() }}
        </TextL1c>
        <TextP class="mt-2 flex items-center">
          {{ formatDate(item.dateOfBirth, (t = false)) }}
          <b class="ml-1"> {{ genderChar }}</b>
        </TextP>
      </div>
      <!-- Record ID -->
      <div v-show="showRecordId" class="hidden lg:block">
        <TextL1>Record ID</TextL1>
        <TextP class="mt-2">
          {{ item.id }}
        </TextP>
      </div>
      <!-- National ID -->
      <div>
        <TextP>
          {{ item.nationalid.trim() }}
        </TextP>
        <masterrecordsNationalIdTypeTag class="mt-2" :nationalid-type="item.nationalidType" />
      </div>
      <!-- Details (large breakpoint only) -->
      <div>
        <TextL1>Last updated</TextL1>
        <TextP class="mt-2">
          {{ formatDate(item.lastUpdated) }}
        </TextP>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
import { MasterRecord } from '@/interfaces/masterrecord'

export default defineComponent({
  props: {
    item: {
      type: Object as () => MasterRecord,
      required: true,
    },
    showRecordId: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  setup(props) {
    const genderChar = computed(() => {
      if (props.item.gender === '1') {
        return '♂'
      } else if (props.item.gender === '2') {
        return '♀'
      } else {
        return ''
      }
    })

    function TagClass(nationalidType: string): string[] {
      if (nationalidType.trim() === 'UKRDC') {
        return ['bg-red-100', 'text-red-800']
      } else if (nationalidType.trim() === 'NHS') {
        return ['bg-blue-100', 'text-blue-800']
      } else if (nationalidType.trim() === 'CHI') {
        return ['bg-purple-100', 'text-purple-800']
      } else if (nationalidType.trim() === 'HSC') {
        return ['bg-green-100', 'text-green-800']
      } else {
        return ['bg-gray-100', 'text-gray-800']
      }
    }

    return { genderChar, TagClass, formatDate }
  },
})
</script>
