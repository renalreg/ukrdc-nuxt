<template>
  <div>
    <BaseCard class="mb-6">
      <BaseCardContent>
        <div v-if="facilityStatsDialysis">
          Statistics calulated from a population of <b>{{ facilityStatsDialysis.metadata.population }}</b> patients,
          from {{ formatDate(facilityStatsDialysis.metadata.fromTime) }} to
          {{ formatDate(facilityStatsDialysis.metadata.toTime) }}
        </div>
        <BaseSkeleText v-else class="h-8 w-2/3" />
      </BaseCardContent>
    </BaseCard>

    <LabelledNetworkSankeyPlot
      id="allPatientsHomeTherapiesPlot"
      :labelled-network="facilityStatsDialysis?.allPatientsHomeTherapies"
      :export-file-name="`all-home-therapies-${facility.id}`"
    />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <LabelledNetworkSankeyPlot
        id="incidentHomeTherapiesPlot"
        :labelled-network="facilityStatsDialysis?.incidentHomeTherapies"
        :export-file-name="`incident-home-therapies-${facility.id}`"
      />
      <LabelledNetworkSankeyPlot
        id="prevalentHomeTherapiesPlot"
        :labelled-network="facilityStatsDialysis?.prevalentHomeTherapies"
        :export-file-name="`prevalent-home-therapies-${facility.id}`"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Labelled2dBarPlot
        id="incentreDialysisFrequencyPlot"
        :labelled2d="facilityStatsDialysis?.incentreDialysisFrequency"
        :export-file-name="`incentre-dialysis-freq-${facility.id}`"
        hovertemplate="Days per week: <b>%{x}</b><br>%{y}<extra></extra>"
        orientation="h"
      />
      <Labelled2dPiePlot
        id="incidentInitialAccessPlot"
        :labelled2d="facilityStatsDialysis?.incidentInitialAccess"
        :export-file-name="`incident-initial-access-${facility.id}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { DialysisStats, FacilityDetailsSchema, FacilityExtractsSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import Labelled2dBarPlot from "~/components/plots/stats/Labelled2dBarPlot.vue";
import Labelled2dPiePlot from "~/components/plots/stats/Labelled2dPiePlot.vue";
import LabelledNetworkSankeyPlot from "~/components/plots/stats/LabelledNetworkSankeyPlot.vue";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    LabelledNetworkSankeyPlot,
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
    const facilityStatsDialysis = ref<DialysisStats>();

    // Data fetching
    onMounted(() => {
      facilitiesApi
        .getFacilityStatsDialysis({
          code: props.facility.id,
        })
        .then((response) => {
          facilityStatsDialysis.value = response.data;
        });
    });

    return {
      facilityStatsDialysis,
      formatDate,
    };
  },
});
</script>
