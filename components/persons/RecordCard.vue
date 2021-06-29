<template>
  <GenericCard>
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 capitalize">
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </h3>
      <p v-if="label" class="mt-1 max-w-2xl text-gray-500">
        {{ label }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="font-medium text-gray-500">Local ID</dt>
          <dd class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 align-middle">
            <div :class="highlight.includes('localid') ? highlightClasses : []">
              {{ realLocalID.localid }}
            </div>
            <div>
              <span :class="highlight.includes('sendingFacility') ? highlightClasses : []">{{
                `${realLocalID.sendingFacility ? realLocalID.sendingFacility : record.localidType}`
              }}</span>
              <span :class="highlight.includes('sendingExtract') ? highlightClasses : []">{{
                `${realLocalID.sendingExtract ? 'via ' + realLocalID.sendingExtract : ''}`
              }}</span>
            </div>
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="font-medium text-gray-500">Date of Birth</dt>
          <dd
            class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('dateOfBirth') ? highlightClasses : []"
          >
            {{ formatDate(record.dateOfBirth, (t = false)) }}
          </dd>
        </div>
        <div v-if="record.dateOfDeath || full" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="font-medium text-gray-500">Date of Death</dt>
          <dd
            class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('dateOfDeath') ? highlightClasses : []"
          >
            {{ record.dateOfDeath ? formatDate(record.dateOfDeath, (t = false)) : 'N/A' }}
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="font-medium text-gray-500">Assigned Gender</dt>
          <dd
            class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2"
            :class="highlight.includes('gender') ? highlightClasses : []"
          >
            {{ formatGender(record.gender) }}
          </dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="font-medium text-gray-500">Last Updated</dt>
          <dd class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">N/A</dd>
        </div>
      </dl>
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
    full: {
      type: Boolean,
      required: false,
      default: false,
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
