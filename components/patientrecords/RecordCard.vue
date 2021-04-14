<template>
  <GenericCard>
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 capitalize">
        {{ record.patient.names[0].given }}
        {{ record.patient.names[0].family }}
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        {{ record.sendingfacility }} via {{ record.sendingextract }}
      </p>
    </div>
    <div v-if="!headerOnly" class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div
          v-if="extraNames.length > 0"
          class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">Other Names</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 align-middle"
          >
            <p
              v-for="name in extraNames"
              :key="name.given + name.family"
              class="mt-1 max-w-2xl text-sm text-gray-500"
            >
              {{ name.given }}
              {{ name.family }}
            </p>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Local ID</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 align-middle"
          >
            {{ record.localpatientid }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatDate(record.patient.birthTime, (t = false)) }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Assigned Gender</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatGender(record.patient.gender) }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatDate(record.repositoryUpdateDate) }}
          </dd>
        </div>
      </dl>
    </div>
  </GenericCard>
</template>

<script lang="ts">
import Vue from 'vue'

import { PatientName } from '@/interfaces/patient'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import { PatientRecord } from '~/interfaces/patientrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin],

  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
    headerOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    extraNames(): PatientName[] {
      if (this.record.patient.names.length > 0) {
        return this.record.patient.names.slice(1)
      } else {
        return []
      }
    },
  },
})
</script>
