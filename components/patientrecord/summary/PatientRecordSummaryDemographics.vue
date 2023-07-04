<template>
  <BaseCard class="grid w-full grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-3">
    <div>
      <h5>Names</h5>
      <p v-for="item in record.patient?.names || []" :key="item.given + item.family" class="sensitive">
        {{ item.given }} {{ item.family }}
      </p>
    </div>
    <div>
      <h5>Gender</h5>
      <p class="sensitive">{{ formatGender(record.patient.gender) }}</p>
    </div>
    <div>
      <h5>Ethnicity</h5>
      <p class="sensitive">
        {{ record.patient.ethnicGroupDescription || record.patient.ethnicGroupCode || "Unknown" }}
      </p>
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
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup() {
    return {
      formatGender,
      formatDate,
    };
  },
});
</script>

<style lang="postcss" scoped></style>
