<template>
  <div>
    <div v-if="!isEmptyObject(record)" class="grid grid-cols-3">
      <div class="col-span-3 mb-4">
        <TextH4 class="mb-3">Demographics</TextH4>
        <GenericCardMini class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-3">
          <div>
            <TextL1> Names </TextL1>
            <TextP v-for="item in record.patient.names" :key="item.given + item.family" class="blurred">
              {{ item.given }} {{ item.family }}
            </TextP>
          </div>
          <div>
            <TextL1> Gender </TextL1>
            <TextP class="blurred">{{ formatGender(record.patient.gender) }}</TextP>
          </div>
          <div>
            <TextL1> Date of Birth </TextL1>
            <TextP class="blurred">{{ formatDate(record.patient.birthTime, (t = false)) }}</TextP>
          </div>
          <div>
            <TextL1> Date of Death </TextL1>
            <TextP class="blurred">
              {{ record.patient.deathTime ? formatDate(record.patient.deathTime, (t = false)) : "N/A" }}
            </TextP>
          </div>
          <div>
            <TextL1> Ethnicity </TextL1>
            <TextP class="blurred">
              {{ record.patient.ethnicGroupDescription || record.patient.ethnicGroupCode || "Unknown" }}
            </TextP>
          </div>
        </GenericCardMini>
      </div>

      <div class="col-span-3 mb-4 sm:col-span-2">
        <TextH4 class="mb-3">History</TextH4>
        <GenericCardMini class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-2">
          <div>
            <TextL1> Record Created </TextL1>
            <TextP>{{ formatDate(record.repositoryCreationDate, (t = true)) }}</TextP>
          </div>
          <div>
            <TextL1> Record Last Updated </TextL1>
            <TextP>{{ formatDate(record.repositoryUpdateDate, (t = true)) }}</TextP>
          </div>
        </GenericCardMini>
      </div>

      <div class="col-span-3 mb-4">
        <TextH4 class="mb-3">Patient Numbers</TextH4>
        <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <li
            v-for="item in record.patient.numbers"
            :key="item.numbertype + item.organization + item.patientid"
            class="col-span-1 flex"
          >
            <GenericCardMini class="flex w-full">
              <div
                class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-indigo-600 font-medium text-white"
              >
                {{ item.numbertype }}
              </div>
              <div class="flex flex-1 items-center justify-between truncate">
                <div class="flex-1 truncate px-4 py-2">
                  <TextB class="blurred truncate">
                    {{ item.patientid }}
                  </TextB>
                  <TextP class="blurred">{{ item.organization }}</TextP>
                </div>
              </div>
            </GenericCardMini>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.patient.addresses && record.patient.addresses.length > 0"
      class="col-span-3 mb-4"
    >
      <TextH4 class="mb-3">Addresses</TextH4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li v-for="item in record.patient.addresses" :key="item.street" class="col-span-1">
          <GenericCardMini class="blurred w-full px-4 py-2">
            <TextB>
              {{ item.street }}
            </TextB>
            <TextP v-if="item.town">{{ item.town }}</TextP>
            <TextP v-if="item.county">
              {{ item.county }}
            </TextP>
            <LinkPostCode v-if="item.postcode" :code="item.postcode" />
            <TextP v-if="item.countryDescription">
              {{ item.countryDescription }}
            </TextP>
            <TextP v-if="item.fromTime">Since {{ formatDate(item.fromTime, (t = false)) }}</TextP>
            <span
              v-if="!item.toTime"
              class="mt-2 inline-block flex-shrink-0 rounded-sm bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800"
              >Active</span
            >
            <span
              v-else
              class="mt-2 inline-block flex-shrink-0 rounded-sm bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800"
              >Inactive since {{ formatDate(item.toTime, (t = false)) }}</span
            >
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.programMemberships && record.programMemberships.length > 0"
      class="col-span-3 mb-4"
    >
      <TextH4 class="mb-3">Program Memberships</TextH4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li
          v-for="(item, index) in record.programMemberships"
          :key="item.programName + index"
          class="col-span-1 flex rounded-md shadow-sm"
        >
          <GenericCardMini class="w-full px-4 py-2">
            <TextB>
              {{ item.programName }}
            </TextB>
            <TextP v-if="item.fromTime">Since {{ formatDate(item.fromTime, (t = false)) }}</TextP>
            <span
              v-if="!item.toTime"
              class="mt-2 inline-block flex-shrink-0 rounded-sm bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800"
              >Active</span
            >
            <span
              v-else
              class="mt-2 inline-block flex-shrink-0 rounded-sm bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800"
              >Closed on {{ formatDate(item.toTime, (t = false)) }}</span
            >
          </GenericCardMini>
        </li>
      </ul>
    </div>

    <div v-if="full && !isEmptyObject(record) && record.patient.familydoctor" class="col-span-3 mb-4">
      <TextH4 class="mb-3">Family Doctor</TextH4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li
          v-for="(info, index) in [
            record.patient.familydoctor.gpInfo,
            record.patient.familydoctor.gpPracticeInfo,
          ].filter((x) => x)"
          :key="`gp-info-${index}`"
          class="col-span-1"
        >
          <GenericCardMini class="blurred w-full px-4 py-2">
            <TextB>{{ info.type }} Information</TextB>
            <TextP>{{ info.gpname || "GP name not known" }}</TextP>
            <TextP>{{ info.street }}</TextP>
            <LinkPostCode v-if="info.postcode" :code="info.postcode" />
            <TextP>Contact {{ info.contactvalue }}</TextP>
          </GenericCardMini>
        </li>
        <li v-if="!record.patient.familydoctor.gpInfo">
          <GenericCardMini class="blurred w-full px-4 py-2">
            <TextB>GP Information</TextB>
            <TextP>{{ record.patient.familydoctor.gpname || "GP name not known" }}</TextP>
            <TextP>{{ record.patient.familydoctor.street }}</TextP>
            <LinkPostCode v-if="record.patient.familydoctor.postcode" :code="record.patient.familydoctor.postcodee" />
            <TextP>Contact {{ record.patient.familydoctor.contactvalue }}</TextP>
          </GenericCardMini>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { formatDate } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";
import { isEmptyObject } from "@/helpers/utils/objectUtils";

import { PatientRecord } from "@/interfaces/patientrecord";

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
    };
  },
});
</script>

<style scoped></style>
