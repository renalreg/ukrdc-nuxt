<template>
  <GenericCard>
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 capitalize">
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </h3>
      <p v-if="label" class="mt-1 max-w-2xl text-sm text-gray-500">
        {{ label }}
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Local ID</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 align-middle"
          >
            <span
              class="inline-flex items-center h-5 px-2.5 py-0.5 mr-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {{ record.localid }}
            </span>
            <masterrecordsNationalIdTypeTag
              :nationalid-type="`${record.localidType} via ${record.originator}`"
            />
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
          <dd
            v-if="record.dateOfDeath"
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
          >
            {{ formatDate(record.dateOfBirth, (t = false)) }} -
            {{ formatDate(record.dateOfDeath, (t = false)) }}
          </dd>
          <dd v-else class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatDate(record.dateOfBirth, (t = false)) }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Assigned Gender</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatGender(record.gender) }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">N/A</dd>
        </div>
      </dl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import Vue from 'vue'

import { Person } from '@/interfaces/persons'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

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
  },
})
</script>
