<template>
  <div>
    <!-- Description list -->
    <GenericCard class="my-8 p-6">
      <GenericDl>
        <GenericDi>
          <TextDt>Local ID</TextDt>
          <TextDd>
            {{ record.localpatientid }}
          </TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>UKRDC ID</TextDt>
          <TextDd>{{ record.ukrdcid }}</TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>Gender</TextDt>
          <TextDd>
            {{ record.patient ? formatGender(record.patient.gender) : '' }}
          </TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>Date of Birth</TextDt>
          <TextDd>
            {{ record.patient ? formatDate(record.patient.birthTime, (t = false)) : '' }}
          </TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>Last Updated</TextDt>
          <TextDd>
            {{ formatDate(record.repositoryUpdateDate) }}
          </TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>Created</TextDt>
          <TextDd>
            {{ formatDate(record.repositoryCreationDate) }}
          </TextDd>
        </GenericDi>
      </GenericDl>
    </GenericCard>

    <PatientrecordsDetailCards :record="record" />

    <div
      v-if="!isEmptyObject(record) && record.programMemberships && record.programMemberships.length > 0"
      class="mt-4"
    >
      <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wide">Program Memberships</h2>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="item in record.programMemberships"
          :key="item.programName"
          class="col-span-1 flex shadow-sm rounded-md"
        >
          <GenericCardMini class="px-4 py-2 w-full">
            <p class="text-gray-900 font-medium hover:text-gray-600">
              {{ item.programName }}
            </p>
            <p v-if="item.fromTime" class="text-gray-500">Since {{ formatDate(item.fromTime, (t = false)) }}</p>
            <span
              v-if="!item.toTime"
              class="
                flex-shrink-0
                inline-block
                px-2
                py-0.5
                text-green-800 text-xs
                font-medium
                bg-green-100
                rounded-sm
                mt-2
              "
              >Active</span
            >
            <span
              v-else
              class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
              >Inactive since {{ formatDate(item.toTime, (t = false)) }}</span
            >
          </GenericCardMini>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'
import { isEmptyObject } from '@/utilities/objectUtils'

import { PatientRecord } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup() {
    return {
      formatDate,
      formatGender,
      isEmptyObject,
    }
  },
})
</script>
