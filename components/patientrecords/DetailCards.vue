<template>
  <div>
    <div>
      <div v-if="!isEmptyObject(record)" class="mt-4">
        <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">History</h2>
        <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li class="col-span-1 sm:col-span-2">
            <GenericCardMini class="px-4 py-2 w-full grid grid-cols-1 sm:grid-cols-2">
              <div>
                <TextL1> Created </TextL1>
                <TextP class="flex items-center">
                  {{ formatDate(record.repositoryCreationDate, (t = true)) }}
                </TextP>
              </div>
              <div>
                <TextL1> Updated </TextL1>
                <TextP class="flex items-center">
                  {{ formatDate(record.repositoryUpdateDate, (t = true)) }}
                </TextP>
              </div>
            </GenericCardMini>
          </li>
        </ul>
      </div>

      <div v-if="!isEmptyObject(record) && record.patient.names && record.patient.names.length > 0" class="mt-4">
        <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Demographics</h2>

        <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="item in record.patient.names" :key="item.given + item.family" class="col-span-1">
            <GenericCardMini class="px-4 py-2 w-full">
              <TextL1> {{ item.given }} {{ item.family }} </TextL1>
              <TextP class="mt-2 flex items-center">
                {{ formatDate(record.patient.birthTime, (t = false)) }}
              </TextP>
            </GenericCardMini>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="!isEmptyObject(record)" class="mt-4">
      <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Patient Numbers</h2>
      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="item in record.patient.numbers"
          :key="item.numbertype + item.organization + item.patientid"
          class="col-span-1 flex"
        >
          <GenericCardMini class="flex w-full">
            <div
              class="
                flex-shrink-0 flex
                items-center
                justify-center
                w-16
                bg-indigo-600
                text-white
                font-medium
                rounded-l-md
              "
            >
              {{ item.numbertype }}
            </div>
            <div class="flex-1 flex items-center justify-between truncate">
              <div class="flex-1 px-4 py-2 truncate">
                <p class="text-gray-900 font-medium hover:text-gray-600 truncate">
                  {{ item.patientid }}
                </p>
                <p class="text-gray-500">{{ item.organization }}</p>
              </div>
            </div>
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div v-if="!isEmptyObject(record) && record.patient.addresses && record.patient.addresses.length > 0" class="mt-4">
      <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Addresses</h2>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in record.patient.addresses" :key="item.street" class="col-span-1">
          <GenericCardMini class="px-4 py-2 w-full">
            <p class="text-gray-900 font-medium hover:text-gray-600">
              {{ item.street }}
            </p>
            <p v-if="item.town" class="text-gray-500">{{ item.town }}</p>
            <p v-if="item.county" class="text-gray-500">
              {{ item.county }}
            </p>
            <p v-if="item.postcode" class="text-gray-500">
              {{ item.postcode }}
            </p>
            <p v-if="item.countryDescription" class="text-gray-500">
              {{ item.countryDescription }}
            </p>
            <p v-if="item.fromTime" class="text-gray-500">Since {{ formatDate(item.fromTime, (t = false)) }}</p>
            <span
              v-if="!item.toTime"
              class="
                flex-shrink-0
                inline-block
                px-2
                py-0.5
                text-green-800 text-sm
                font-medium
                bg-green-100
                rounded-sm
                mt-2
              "
              >Active</span
            >
            <span
              v-else
              class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-sm font-medium bg-red-100 rounded-sm mt-2"
              >Inactive since {{ formatDate(item.toTime, (t = false)) }}</span
            >
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.programMemberships && record.programMemberships.length > 0"
      class="mt-4"
    >
      <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Program Memberships</h2>

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
                text-green-800 text-sm
                font-medium
                bg-green-100
                rounded-sm
                mt-2
              "
              >Active</span
            >
            <span
              v-else
              class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-sm font-medium bg-red-100 rounded-sm mt-2"
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

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'
import { isEmptyObject } from '@/helpers/utils/objectUtils'

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

<style scoped></style>
