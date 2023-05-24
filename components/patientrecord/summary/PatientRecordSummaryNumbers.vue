<template>
  <!-- External patient numbers -->
  <ul>
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
    <!-- Internal patient numbers -->
    <li class="col-span-1">
      <PatientRecordNumberCard class="w-full" :number="record.ukrdcid" numbertype="UKRDC" organization="UKKA" />
    </li>
    <li class="col-span-1">
      <PatientRecordNumberCard class="w-full" :number="record.pid" numbertype="PID" organization="UKKA" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import PatientRecordNumberCard from "~/components/patientrecord/summary/PatientRecordNumberCard.vue";

export default defineComponent({
  components: {
    PatientRecordNumberCard,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="postcss" scoped></style>
