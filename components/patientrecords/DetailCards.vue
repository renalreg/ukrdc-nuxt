<template>
  <div>
    <div v-if="!isEmptyObject(record)">
      <TextH4>Demographics</TextH4>
      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li class="col-span-1 sm:col-span-2">
          <GenericCardMini class="px-4 py-2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <TextL1> Names </TextL1>
              <TextP v-for="item in record.patient.names" :key="item.given + item.family">
                {{ item.given }} {{ item.family }}
              </TextP>
            </div>
            <div>
              <TextL1> Gender </TextL1>
              <TextP>{{ formatGender(record.patient.gender) }}</TextP>
            </div>
            <div>
              <TextL1> Date of Birth </TextL1>
              <TextP>{{ formatDate(record.patient.birthTime, (t = false)) }}</TextP>
            </div>
            <div>
              <TextL1> Date of Death </TextL1>
              <TextP>
                {{ record.patient.deathTime ? formatDate(record.patient.deathTime, (t = false)) : 'N/A' }}
              </TextP>
            </div>
            <div>
              <TextL1> Ethnicity </TextL1>
              <TextP>
                {{ record.patient.ethnicGroupDescription || record.patient.ethnicGroupCode || 'Unknown' }}
              </TextP>
            </div>
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div v-if="!isEmptyObject(record)" class="mt-4">
      <TextH4>Patient Numbers</TextH4>
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
                <TextB class="truncate">
                  {{ item.patientid }}
                </TextB>
                <TextP>{{ item.organization }}</TextP>
              </div>
            </div>
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div v-if="!isEmptyObject(record) && record.patient.addresses && record.patient.addresses.length > 0" class="mt-4">
      <TextH4>Addresses</TextH4>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in record.patient.addresses" :key="item.street" class="col-span-1">
          <GenericCardMini class="px-4 py-2 w-full">
            <TextB>
              {{ item.street }}
            </TextB>
            <TextP v-if="item.town">{{ item.town }}</TextP>
            <TextP v-if="item.county">
              {{ item.county }}
            </TextP>
            <TextP v-if="item.postcode">
              {{ item.postcode }}
            </TextP>
            <TextP v-if="item.countryDescription">
              {{ item.countryDescription }}
            </TextP>
            <TextP v-if="item.fromTime">Since {{ formatDate(item.fromTime, (t = false)) }}</TextP>
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
      <TextH4>Program Memberships</TextH4>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="item in record.programMemberships"
          :key="item.programName"
          class="col-span-1 flex shadow-sm rounded-md"
        >
          <GenericCardMini class="px-4 py-2 w-full">
            <TextB>
              {{ item.programName }}
            </TextB>
            <TextP v-if="item.fromTime">Since {{ formatDate(item.fromTime, (t = false)) }}</TextP>
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
              >Closed on {{ formatDate(item.toTime, (t = false)) }}</span
            >
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div v-if="full && !isEmptyObject(record) && record.patient.familydoctor" class="mt-4">
      <TextH4>Family Doctor</TextH4>

      <ul class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(info, index) in [
            record.patient.familydoctor.gpInfo,
            record.patient.familydoctor.gpPracticeInfo,
          ].filter((x) => x)"
          :key="`gp-info-${index}`"
          class="col-span-1"
        >
          <GenericCardMini class="px-4 py-2 w-full">
            <TextB>{{ info.type }} Information</TextB>
            <TextP>{{ info.gpname || 'GP name not known' }}</TextP>
            <TextP>{{ info.street }}</TextP>
            <TextP>{{ info.postcode }}</TextP>
            <TextP>Contact {{ info.contactvalue }}</TextP>
          </GenericCardMini>
        </li>
        <li v-if="!record.patient.familydoctor.gpInfo">
          <GenericCardMini class="px-4 py-2 w-full">
            <TextB>GP Information</TextB>
            <TextP>{{ record.patient.familydoctor.gpname || 'GP name not known' }}</TextP>
            <TextP>{{ record.patient.familydoctor.street }}</TextP>
            <TextP>{{ record.patient.familydoctor.postcode }}</TextP>
            <TextP>Contact {{ record.patient.familydoctor.contactvalue }}</TextP>
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
    full: {
      type: Boolean,
      required: false,
      default: false,
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
