<template>
  <div v-if="facilityStatsDemographics">
    <Labelled2dBarPlot
      id="facilityStatsDemographicsAge"
      :labelled2d="facilityStatsDemographics.age"
      :export-file-name="`age-distribution-${facility.id}`"
      hovertemplate="Age: <b>%{x}</b><br>%{y}<extra></extra>"
    />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Labelled2dPiePlot
        id="genderDistributionChart"
        :labelled2d="facilityStatsDemographics.gender"
        :export-file-name="`gender-distribution-${facility.id}`"
      />
      <Labelled2dPiePlot
        id="ethnicityDistributionChart"
        :labelled2d="facilityStatsDemographics.ethnicGroup"
        :export-file-name="`ethnicity-distribution-${facility.id}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { DemographicsStats, FacilityDetailsSchema } from "@ukkidney/ukrdc-axios-ts";

import Labelled2dBarPlot from "~/components/plots/stats/Labelled2dBarPlot.vue";
import Labelled2dPiePlot from "~/components/plots/stats/Labelled2dPiePlot.vue";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    Labelled2dBarPlot,
    Labelled2dPiePlot,
  },
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },
  setup(props) {
    const { facilitiesApi } = useApi();

    // Data refs
    const facilityStatsDemographics = ref<DemographicsStats>();

    // Data fetching
    onMounted(() => {
      facilitiesApi
        .getFacilityStatsDemographics({
          code: props.facility.id,
        })
        .then((response) => {
          facilityStatsDemographics.value = response.data;
        });
    });

    return {
      facilityStatsDemographics,
    };
  },
});
</script>
