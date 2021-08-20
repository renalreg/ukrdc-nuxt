<template>
  <GenericCard>
    <div class="px-4 sm:px-6 h-24 flex flex-col justify-center">
      <h3
        class="text-lg leading-6 font-medium text-gray-900 capitalize"
        :class="highlight.includes('name') ? highlightClasses : []"
      >
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </h3>
      <p class="mt-1 max-w-2xl text-gray-500">
        {{ label ? label : `Master Record ${record.id}` }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <GenericCardDl>
        <GenericCardDi>
          <GenericCardDt>National ID</GenericCardDt>
          <GenericCardDd>
            {{ record.nationalid }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>ID Type</GenericCardDt>
          <GenericCardDd class="align-middle">
            {{ record.nationalidType }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Birth</GenericCardDt>
          <GenericCardDd :class="highlight.includes('dateOfBirth') ? highlightClasses : []">
            {{ formatDate(record.dateOfBirth, (t = false)) }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Assigned Gender</GenericCardDt>
          <GenericCardDd :class="highlight.includes('gender') ? highlightClasses : []">
            {{ formatGender(record.gender) }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Last Updated</GenericCardDt>
          <GenericCardDd>
            {{ formatDate(record.lastUpdated) }}
          </GenericCardDd>
        </GenericCardDi>
      </GenericCardDl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { MasterRecord } from '~/interfaces/masterrecord'

export default defineComponent({
  props: {
    record: {
      type: Object as () => MasterRecord,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    highlight: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup() {
    const highlightClasses = [
      'bg-red-100',
      'text-red-800',
      'font-medium',
      'rounded-md',
      'pl-2',
      '-ml-2',
      'pr-2',
      'mr-2',
    ]
    return { highlightClasses, formatDate, formatGender }
  },
})
</script>
