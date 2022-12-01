<template>
  <div>
    <BaseCard class="mb-6">
      <BaseCardContent>
        <div v-if="facilityStatsDemographics">
          Demographic statistics calulated from a population of
          <b>{{ facilityStatsDemographics.metadata.population }}</b> patients.
        </div>
        <BaseSkeleText v-else class="h-8 w-1/2" />
      </BaseCardContent>
    </BaseCard>

    <Labelled2dBarPlot
      id="ageDistributionPlot"
      :labelled2d="facilityStatsDemographics?.age"
      :export-file-name="`age-distribution-${facility.id}`"
      hovertemplate="Age: <b>%{x}</b><br>%{y}<extra></extra>"
    />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Labelled2dPiePlot
        id="genderDistributionPlot"
        :labelled2d="facilityStatsDemographics?.gender"
        :export-file-name="`gender-distribution-${facility.id}`"
      />
      <Labelled2dPiePlot
        id="ethnicityDistributionPlot"
        :labelled2d="facilityStatsDemographics?.ethnicGroup"
        :export-file-name="`ethnicity-distribution-${facility.id}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { DemographicsStats, FacilityDetailsSchema, FacilityExtractsSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import Labelled2dBarPlot from "~/components/plots/stats/Labelled2dBarPlot.vue";
import Labelled2dPiePlot from "~/components/plots/stats/Labelled2dPiePlot.vue";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    Labelled2dBarPlot,
    Labelled2dPiePlot,
    BaseCard,
    BaseCardContent,
    BaseSkeleText,
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
