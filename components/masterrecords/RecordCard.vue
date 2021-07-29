<template>
  <GenericCard>
    <div class="px-4 py-5 sm:px-6">
      <h3
        class="text-lg leading-6 font-medium text-gray-900 capitalize"
        :class="highlight.includes('name') ? highlightClasses : []"
      >
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
          <dt class="font-medium text-gray-500">National ID</dt>
          <dd class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 align-middle">
            <p>
              {{ record.nationalid }}
            </p>
            <p>
              {{ record.nationalidType }}
            </p>
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
          <dd class="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatDate(record.lastUpdated) }}
          </dd>
        </div>
      </dl>
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
