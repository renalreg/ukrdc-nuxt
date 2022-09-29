<template>
  <div class="mb-2">
    <TimeSeriesLinePlot
      v-if="facilityErrorsHistory"
      class="h-64"
      :x="facilityErrorsHistoryData.x"
      :y="facilityErrorsHistoryData.y"
      y-label="New Errors"
      hovertemplate="<b>%{x}</b><br>New errors: %{y}<extra></extra>"
      @click="historyPointClickHandler"
    />
    <BaseSkeleImage v-else class="h-64 w-full" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRouter } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, HistoryPoint } from "@ukkidney/ukrdc-axios-ts";
import { PlotDatum } from "plotly.js";

import BaseSkeleImage from "~/components/base/BaseSkeleImage.vue";
import TimeSeriesLinePlot from "~/components/plots/TimeSeriesLinePlot.vue";
import useApi from "~/composables/useApi";
import { getPointDateRange, unpackHistoryPoints } from "~/helpers/chartUtils";

export default defineComponent({
  components: {
    TimeSeriesLinePlot,
    BaseSkeleImage,
  },
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const { facilitiesApi } = useApi();

    // Data refs
    const facilityErrorsHistory = ref<HistoryPoint[]>();
    const facilityErrorsHistoryData = computed(() => {
      return unpackHistoryPoints(facilityErrorsHistory.value ?? []);
    });

    // History plot click handler

    function historyPointClickHandler(point: PlotDatum) {
      if (point.x) {
        const pointRange = getPointDateRange(point.x as string);
        router.push({
          path: "/messages",
          query: {
            since: pointRange.since,
            until: pointRange.until,
            facility: props.facility.id,
            status: ["ERROR", "RESOLVED"],
          },
        });
      }
    }

    // Data fetching

    function updateErrorsHistory() {
      facilitiesApi
        .getFacilityErrrorsHistory({
          code: props.facility.id,
        })
        .then((response) => {
          facilityErrorsHistory.value = response.data;
        });
    }

    onMounted(() => {
      updateErrorsHistory();
    });

    return {
      facilityErrorsHistory,
      facilityErrorsHistoryData,
      historyPointClickHandler,
    };
  },
});
</script>
