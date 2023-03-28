<template>
  <div>
    <BaseCard class="mb-6">
      <BaseCardContent>
        <div v-if="facilityStatsDialysis">
          Statistics calulated from a population of <b>{{ facilityStatsDialysis.all.metadata.population }}</b> patients,
          from {{ formatDate(facilityStatsDialysis.all.metadata.fromTime) }} to
          {{ formatDate(facilityStatsDialysis.all.metadata.toTime) }}
        </div>
        <BaseSkeleText v-else class="h-8 w-2/3" />
      </BaseCardContent>
    </BaseCard>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Labelled2dPiePlot
        id="allPatientsHomeTherapiesPlot"
        :labelled2d="facilityStatsDialysis?.all.allPatientsHomeTherapies"
        :export-file-name="`incident-initial-access-${facility.id}`"
        :text="facilityStatsDialysis?.all.allPatientsHomeTherapies?.metadata?.populationSize?.toString()"
      />
      <Labelled2dBarPlot
        id="incentreDialysisFrequencyPlot"
        :labelled2d="facilityStatsDialysis?.all.incentreDialysisFrequency"
        :export-file-name="`incentre-dialysis-freq-${facility.id}`"
        hovertemplate="Days per week: <b>%{x}</b><br>%{y}<extra></extra>"
        orientation="h"
        x-type="category"
      />
    </div>

    <br />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Labelled2dPiePlot
        id="incidentHomeTherapiesPlot"
        :labelled2d="facilityStatsDialysis?.all.incidentHomeTherapies"
        :export-file-name="`incident-home-therapies-${facility.id}`"
        :text="facilityStatsDialysis?.all.incidentHomeTherapies?.metadata?.populationSize?.toString()"
      />
      <Labelled2dPiePlot
        id="incidentInitialAccessPlot"
        :labelled2d="facilityStatsDialysis?.all.incidentInitialAccess"
        :export-file-name="`incident-initial-access-${facility.id}`"
        :text="facilityStatsDialysis?.all.incidentInitialAccess?.metadata?.populationSize?.toString()"
      />
    </div>

    <br />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Labelled2dPiePlot
        id="prevalentHomeTherapiesPlot"
        :labelled2d="facilityStatsDialysis?.all.prevalentHomeTherapies"
        :export-file-name="`prevalent-home-therapies-${facility.id}`"
        :text="facilityStatsDialysis?.all.prevalentHomeTherapies?.metadata?.populationSize?.toString()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, FacilityExtractsSchema, UnitLevelDialysisStats } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import Labelled2dBarPlot from "~/components/plots/stats/Labelled2dBarPlot.vue";
import Labelled2dPiePlot from "~/components/plots/stats/Labelled2dPiePlot.vue";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

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
    const facilityStatsDialysis = ref<UnitLevelDialysisStats>();

    // Data fetching
    onMounted(() => {
      facilitiesApi
        .getFacilityStatsKrt({
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
