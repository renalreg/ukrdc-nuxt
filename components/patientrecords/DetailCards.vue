<template>
  <div>
    <div v-if="!isEmptyObject(record)" class="grid grid-cols-3">
      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Demographics</h4>
        <BaseCard class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-3">
          <div>
            <TextL1> Names </TextL1>
            <p v-for="item in record.patient.names" :key="item.given + item.family" class="sensitive">
              {{ item.given }} {{ item.family }}
            </p>
          </div>
          <div>
            <TextL1> Gender </TextL1>
            <p class="sensitive">{{ formatGender(record.patient.gender) }}</p>
          </div>
          <div>
            <TextL1> Date of Birth </TextL1>
            <p class="sensitive">{{ formatDate(record.patient.birthTime, (t = false)) }}</p>
          </div>
          <div>
            <TextL1> Date of Death </TextL1>
            <p class="sensitive">
              {{ record.patient.deathTime ? formatDate(record.patient.deathTime, (t = false)) : "N/A" }}
            </p>
          </div>
          <div>
            <TextL1> Ethnicity </TextL1>
            <p class="sensitive">
              {{ record.patient.ethnicGroupDescription || record.patient.ethnicGroupCode || "Unknown" }}
            </p>
          </div>
        </BaseCard>
      </div>

      <div class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">History</h4>
        <BaseCard class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-2">
          <div>
            <TextL1> Record Created </TextL1>
            <p>{{ formatDate(record.repositoryCreationDate, (t = true)) }}</p>
          </div>
          <div>
            <TextL1> Record Last Updated </TextL1>
            <p>{{ formatDate(record.repositoryUpdateDate, (t = true)) }}</p>
          </div>
        </BaseCard>
      </div>

      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Patient Numbers</h4>
        <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <li
            v-for="item in record.patient.numbers"
            :key="item.numbertype + item.organization + item.patientid"
            class="col-span-1 flex"
          >
            <BaseCard class="flex w-full">
              <div
                class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-indigo-600 font-medium text-white"
              >
                {{ item.numbertype }}
              </div>
              <div class="flex flex-1 items-center justify-between truncate">
                <div class="flex-1 truncate px-4 py-2">
                  <b class="sensitive truncate">
                    {{ item.patientid }}
                  </b>
                  <p class="sensitive">{{ item.organization }}</p>
                </div>
              </div>
            </BaseCard>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.patient.addresses && record.patient.addresses.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Addresses</h4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li v-for="item in record.patient.addresses" :key="item.street" class="col-span-1">
          <BaseCard class="sensitive w-full px-4 py-2">
            <b>
              {{ item.street }}
            </b>
            <p v-if="item.town">{{ item.town }}</p>
            <p v-if="item.county">
              {{ item.county }}
            </p>
            <LinkPostCode v-if="item.postcode" :code="item.postcode" />
            <p v-if="item.countryDescription">
              {{ item.countryDescription }}
            </p>
            <p v-if="item.fromTime">Since {{ formatDate(item.fromTime, (t = false)) }}</p>
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
          </BaseCard>
        </li>
      </ul>
    </div>

    <div
      v-if="!isEmptyObject(record) && record.programMemberships && record.programMemberships.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Program Memberships</h4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li
          v-for="(item, index) in record.programMemberships"
          :key="item.programName + index"
          class="col-span-1 flex rounded-md shadow-sm"
        >
          <BaseCard class="w-full px-4 py-2">
            <b>
              {{ item.programName }}
            </b>
            <p v-if="item.fromTime">Since {{ formatDate(item.fromTime, (t = false)) }}</p>
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
          </BaseCard>
        </li>
      </ul>
    </div>

    <div v-if="full && !isEmptyObject(record) && record.patient.familydoctor" class="col-span-3 mb-4">
      <h4 class="mb-3">Family Doctor</h4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li
          v-for="(info, index) in [
            record.patient.familydoctor.gpInfo,
            record.patient.familydoctor.gpPracticeInfo,
          ].filter((x) => x)"
          :key="`gp-info-${index}`"
          class="col-span-1"
        >
          <BaseCard class="sensitive w-full px-4 py-2">
            <b>{{ info.type }} Information</b>
            <p>{{ info.gpname || "GP name not known" }}</p>
            <p>{{ info.street }}</p>
            <LinkPostCode v-if="info.postcode" :code="info.postcode" />
            <p>Contact {{ info.contactvalue }}</p>
          </BaseCard>
        </li>
        <li v-if="!record.patient.familydoctor.gpInfo">
          <BaseCard class="sensitive w-full px-4 py-2">
            <b>GP Information</b>
            <p>{{ record.patient.familydoctor.gpname || "GP name not known" }}</p>
            <p>{{ record.patient.familydoctor.street }}</p>
            <LinkPostCode v-if="record.patient.familydoctor.postcode" :code="record.patient.familydoctor.postcodee" />
            <p>Contact {{ record.patient.familydoctor.contactvalue }}</p>
          </BaseCard>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
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
