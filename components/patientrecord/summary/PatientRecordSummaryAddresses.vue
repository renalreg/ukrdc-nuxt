<template>
  <ul>
    <li v-for="item in record.patient.addresses" :key="item.street" class="col-span-1">
      <BaseCard class="sensitive w-full px-4 py-2"> <PatientRecordAddress :address="item" /> </BaseCard>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import PatientRecordAddress from "~/components/patientrecord/summary/PatientRecordAddress.vue";

export default defineComponent({
  components: {
    BaseCard,
    PatientRecordAddress,
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
