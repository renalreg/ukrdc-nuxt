<template>
  <div>
    <div v-if="!isEmptyObject(record)" class="grid grid-cols-3">
      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Demographics</h4>
        <BaseCard class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-3">
          <div>
            <h5>Names</h5>
            <p v-for="item in record.patient.names" :key="item.given + item.family" class="sensitive">
              {{ item.given }} {{ item.family }}
            </p>
          </div>
          <div>
            <h5>Gender</h5>
            <p class="sensitive">{{ formatGender(record.patient.gender) }}</p>
          </div>
          <div>
            <h5>Date of Birth</h5>
            <p class="sensitive">{{ formatDate(record.patient.birthTime, false) }}</p>
          </div>
          <div>
            <h5>Date of Death</h5>
            <p class="sensitive">
              {{ record.patient.deathTime ? formatDate(record.patient.deathTime, false) : "N/A" }}
            </p>
          </div>
          <div>
            <h5>Ethnicity</h5>
            <p class="sensitive">
              {{ record.patient.ethnicGroupDescription || record.patient.ethnicGroupCode || "Unknown" }}
            </p>
          </div>
        </BaseCard>
      </div>

      <div v-if="full" class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">History</h4>
        <BaseCard class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-2">
          <div>
            <h5>Record Created</h5>
            <p>{{ formatDate(record.repositoryCreationDate, (t = true)) }}</p>
          </div>
          <div>
            <h5>Record Last Updated</h5>
            <p>{{ formatDate(record.repositoryUpdateDate, (t = true)) }}</p>
          </div>
        </BaseCard>
      </div>

      <div class="col-span-3 mb-4">
        <h4 class="mb-3">Patient Numbers</h4>
        <!-- External patient numbers -->
        <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <li
            v-for="item in record.patient.numbers"
            :key="item.numbertype + item.organization + item.patientid"
            class="col-span-1"
          >
            <PatientRecordNumberCard
              class="w-full"
              :number="item.patientid"
              :numbertype="item.numbertype"
              :organization="item.organization"
            />
          </li>
        </ul>
        <!-- Internal patient numbers -->
        <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 mt-2">
          <li class="col-span-1">
            <PatientRecordNumberCard class="w-full" :number="record.ukrdcid" numbertype="UKRDC" organization="UKKA" />
          </li>
          <li class="col-span-1">
            <PatientRecordNumberCard class="w-full" :number="record.pid" numbertype="PID" organization="UKKA" />
          </li>
        </ul>
      </div>

      <div v-if="record.pvdata" class="col-span-3 mb-4 sm:col-span-2">
        <h4 class="mb-3">RRT Information</h4>
        <BaseCard class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-2">
          <div>
            <h5>RRT Status</h5>
            <p>{{ record.pvdata.rrtstatus || "Unknown" }}</p>
          </div>
          <div>
            <h5>Transplant Status</h5>
            <p>{{ record.pvdata.tpstatus || "Unknown" }}</p>
          </div>
          <div>
            <h5>Blood Group</h5>
            <p>{{ record.pvdata.bloodgroup || "Unknown" }}</p>
          </div>
          <div>
            <h5>Last Updated</h5>
            <p>{{ formatDate(record.pvdata.updateDate || record.pvdata.creationDate, (t = true)) }}</p>
          </div>
        </BaseCard>
      </div>

    </div>

    <div
      v-if="!isEmptyObject(record) && record.patient.addresses && record.patient.addresses.length > 0"
      class="col-span-3 mb-4"
    >
      <h4 class="mb-3">Addresses</h4>

      <ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <li v-for="item in record.patient.addresses" :key="item.street" class="col-span-1">
          <BaseCard class="sensitive w-full px-4 py-2"> <PatientRecordAddress :address="item" /> </BaseCard>
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
            <p v-if="item.fromTime">Since {{ formatDate(item.fromTime, false) }}</p>
            <div class="mt-2">
              <BaseBadge v-if="!item.toTime" class="bg-green-100 text-green-800">Active</BaseBadge>
              <BaseBadge v-else class="bg-red-100 text-red-800"
                >Closed on {{ formatDate(item.toTime, false) }}</BaseBadge
              >
            </div>
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
            <PostCodeLink v-if="info.postcode" :code="info.postcode" />
            <p>Contact {{ info.contactvalue }}</p>
          </BaseCard>
        </li>
        <li v-if="!record.patient.familydoctor.gpInfo">
          <BaseCard class="sensitive w-full px-4 py-2">
            <b>GP Information</b>
            <p>{{ record.patient.familydoctor.gpname || "GP name not known" }}</p>
            <p>{{ record.patient.familydoctor.street }}</p>
            <PostCodeLink v-if="record.patient.familydoctor.postcode" :code="record.patient.familydoctor.postcodee" />
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

import BaseBadge from "~/components/base/BaseBadge.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import PatientRecordAddress from "~/components/PatientRecordAddress.vue";
import PatientRecordNumberCard from "~/components/PatientRecordNumberCard.vue";
import PostCodeLink from "~/components/PostCodeLink.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseBadge,
    PostCodeLink,
    PatientRecordAddress,
    PatientRecordNumberCard,
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
