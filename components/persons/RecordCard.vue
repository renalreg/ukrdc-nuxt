<template>
  <GenericCard>
    <div class="px-4 sm:px-6 h-24 flex flex-col justify-center">
      <span
        :class="highlight.includes('givenname') || highlight.includes('surname') ? highlightClasses : ['text-gray-900']"
      >
        <h3 class="text-lg leading-6 font-medium capitalize">
          {{ record.givenname.toLowerCase() }}
          {{ record.surname.toLowerCase() }}
        </h3>
      </span>

      <p class="mt-1 max-w-2xl text-gray-500">
        {{ label ? label : `Person Record ${record.id}` }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <GenericCardDl>
        <GenericCardDi>
          <GenericCardDt>Local ID</GenericCardDt>
          <GenericCardDd :class="highlight.includes('localid') ? highlightClasses : []">
            {{ realLocalID.localid }}
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Sender</GenericCardDt>
          <GenericCardDd>
            <span :class="highlight.includes('sendingFacility') ? highlightClasses : []">{{
              `${realLocalID.sendingFacility ? realLocalID.sendingFacility : record.localidType}`
            }}</span>
            <span :class="highlight.includes('sendingExtract') ? highlightClasses : []">{{
              `${realLocalID.sendingExtract ? 'via ' + realLocalID.sendingExtract : ''}`
            }}</span>
          </GenericCardDd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Birth</GenericCardDt>
          <dd
            class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('dateOfBirth') ? highlightClasses : []"
          >
            {{ formatDate(record.dateOfBirth, (t = false)) }}
          </dd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Assigned Gender</GenericCardDt>
          <dd
            class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('gender') ? highlightClasses : []"
          >
            {{ formatGender(record.gender) }}
          </dd>
        </GenericCardDi>
        <GenericCardDi>
          <GenericCardDt>Date of Death</GenericCardDt>
          <dd
            class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('dateOfDeath') ? highlightClasses : []"
          >
            {{ record.dateOfDeath ? formatDate(record.dateOfDeath, (t = false)) : 'N/A' }}
          </dd>
        </GenericCardDi>
      </GenericCardDl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { Person } from '@/interfaces/persons'

interface realLocalId {
  localid: string
  sendingExtract?: string
  sendingFacility?: string
}

export default defineComponent({
  props: {
    record: {
      type: Object as () => Person,
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

  setup(props) {
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

    const realLocalID = computed<realLocalId>(() => {
      if (props.record.localidType !== 'CLPID') {
        return {
          localid: props.record.localid,
        }
      }
      for (const xref of props.record.xrefEntries) {
        if (xref.pid === props.record.localid) {
          return {
            localid: xref.localid,
            sendingExtract: xref.sendingExtract,
            sendingFacility: xref.sendingFacility,
          }
        }
      }
      return {
        localid: props.record.localid,
      }
    })

    return { formatDate, formatGender, highlightClasses, realLocalID }
  },
})
</script>
