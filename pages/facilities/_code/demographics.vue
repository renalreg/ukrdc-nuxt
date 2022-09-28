<template>
  <div>
    <FacilityStatsDemographics v-if="facility" :facility="facility" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, FacilityExtractsSchema } from "@ukkidney/ukrdc-axios-ts";

import FacilityStatsDemographics from "~/components/FacilityStatsDemographics.vue";

export default defineComponent({
  components: {
    FacilityStatsDemographics,
  },
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
    extracts: {
      type: Object as () => FacilityExtractsSchema,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>
