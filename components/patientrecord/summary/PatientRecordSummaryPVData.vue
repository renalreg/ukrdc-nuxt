<template>
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
      <p>{{ formatDate(record.pvdata.updateDate || record.pvdata.creationDate, true) }}</p>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
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
      formatDate,
    };
  },
});
</script>

<style lang="postcss" scoped></style>
