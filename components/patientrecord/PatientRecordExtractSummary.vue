<template>
  <div v-if="isData(record)" class="flex gap-1">
    <p>
      {{ `${record.sendingextract === "UKRDC" ? "RDA" : record.sendingextract} data feed record from` }}
    </p>
    <SendingFacilityLink class="font-medium" :code="record.sendingfacility" />
  </div>
  <div v-else-if="record.sendingextract === 'PVMIG'" class="flex gap-1">
    <p>Historically migrated PV data feed record from</p>
    <SendingFacilityLink class="font-medium" :code="record.sendingfacility" />
  </div>
  <div v-else-if="record.sendingextract === 'HSMIG'" class="flex gap-1">
    <p>Historically migrated Healthshare data feed record from</p>
    <SendingFacilityLink class="font-medium" :code="record.sendingfacility" />
  </div>
  <div v-else-if="record.sendingextract === 'RADAR'" class="flex gap-1">
    <p>RADAR membership record for</p>
    <SendingFacilityLink class="font-medium" :code="record.sendingfacility" />
  </div>
  <div v-else-if="isMembership(record)">
    {{ `${record.sendingfacility} membership record` }}
  </div>
  <div v-else-if="isInformational(record)">
    {{ `Informational ${record.sendingfacility} record` }}
  </div>
  <div v-else class="flex gap-1">
    <SendingFacilityLink class="font-medium" :code="record.sendingfacility" />
    <p>{{ `via ${record.sendingextract}` }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import { isData, isInformational, isMembership } from "~/helpers/recordUtils";

export default defineComponent({
  components: {
    SendingFacilityLink,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSummarySchema,
      required: true,
    },
  },
  setup() {
    return { isData, isMembership, isInformational };
  },
});
</script>
