<!--
Admin (permission ukrdc:facilities:*) dashboard with overview of all facilities.
-->

<template>
  <div>
    <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <BaseCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconUsers class="text-gray-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <h5>Total Patients</h5>
            <h1 v-if="counts" class="text-green-600">{{ counts.distinctPatients }}</h1>
            <BaseSkeleText v-else class="h-8 w-24" />
          </div>
        </div>
        <BaseCardFooter>Total distinct UKRDC IDs in the database</BaseCardFooter>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconLink class="text-gray-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <h5>Open Work Items</h5>
            <h1 v-if="counts" :class="counts.openWorkitems > 0 ? 'text-yellow-600' : 'text-green-600'">
              {{ counts.openWorkitems }}
            </h1>
            <BaseSkeleText v-else class="h-8 w-24" />
          </div>
        </div>
        <BaseCardFooter>Work Items currently open or WIP</BaseCardFooter>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconExclamationTriangle class="text-gray-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <h5>Active Failing Records</h5>
            <h1 v-if="counts" :class="counts.patientsReceivingErrors > 0 ? 'text-red-600' : 'text-green-600'">
              {{ counts.patientsReceivingErrors }}
            </h1>
            <BaseSkeleText v-else class="h-8 w-24" />
          </div>
        </div>
        <BaseCardFooter>Records with active data files currently failing due to errors </BaseCardFooter>
      </BaseCard>
    </div>
    <!-- Graphs -->
    <div class="flex flex-col gap-4">
      <!-- Error history -->
      <BaseCard>
        <BaseCardHeader>
          <h2>Error History</h2>
        </BaseCardHeader>
        <BaseTimeSeriesLinePlot
          v-if="errorsHistory"
          id="error-history-time-series"
          class="h-64"
          :x="errorsHistoryData.x"
          :y="errorsHistoryData.y"
          y-label="New Errors"
          hovertemplate="<b>%{x}</b><br>New errors: %{y}<extra></extra>"
          @click="errorHistoryPointClickHandler"
        />
        <BaseSkeleDiv v-else class="h-64 w-full" />
      </BaseCard>
      <!-- WorkItems history -->
      <BaseCard>
        <BaseCardHeader>
          <h2>Work Items History</h2>
        </BaseCardHeader>
        <BaseTimeSeriesLinePlot
          v-if="workitemsHistory"
          id="workitem-history-time-series"
          class="h-64"
          :x="workitemsHistoryData.x"
          :y="workitemsHistoryData.y"
          y-label="New Work Items"
          hovertemplate="<b>%{x}</b><br>New work items: %{y}<extra></extra>"
          @click="workitemHistoryPointClickHandler"
        />
        <BaseSkeleDiv v-else class="h-64 w-full" />
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRouter } from "@nuxtjs/composition-api";
import { AdminCountsSchema, HistoryPoint } from "@ukkidney/ukrdc-axios-ts";
import { PlotDatum } from "plotly.js";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardFooter from "~/components/base/BaseCardFooter.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleDiv from "~/components/base/BaseSkeleDiv.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import IconExclamationTriangle from "~/components/icons/hero/24/outline/IconExclamationTriangle.vue";
import IconLink from "~/components/icons/hero/24/outline/IconLink.vue";
import IconUsers from "~/components/icons/hero/24/outline/IconUsers.vue";
import BaseTimeSeriesLinePlot from "~/components/plots/base/BaseTimeSeriesLinePlot.vue";
import useApi from "~/composables/useApi";
import { getPointDateRange, unpackHistoryPoints } from "~/helpers/chartUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardHeader,
    BaseCardFooter,
    BaseSkeleText,
    BaseSkeleDiv,
    IconExclamationTriangle,
    IconLink,
    IconUsers,
    BaseTimeSeriesLinePlot,
  },
  setup() {
    const router = useRouter();
    const { adminApi } = useApi();

    const counts = ref<AdminCountsSchema>();

    // Errors history
    const errorsHistory = ref<HistoryPoint[]>();
    const errorsHistoryData = computed(() => {
      return unpackHistoryPoints(errorsHistory.value ?? []);
    });

    // Work item history
    const workitemsHistory = ref<HistoryPoint[]>();
    const workitemsHistoryData = computed(() => {
      return unpackHistoryPoints(workitemsHistory.value ?? []);
    });

    // History plot click handler

    function errorHistoryPointClickHandler(point: PlotDatum) {
      if (point.x) {
        const pointRange = getPointDateRange(point.x as string);
        router.push({
          path: "/messages",
          query: {
            since: pointRange.since,
            until: pointRange.until,
            status: ["ERROR", "RESOLVED"],
          },
        });
      }
    }

    function workitemHistoryPointClickHandler(point: PlotDatum) {
      if (point.x) {
        const pointRange = getPointDateRange(point.x as string);
        router.push({
          path: "/workitems",
          query: {
            since: pointRange.since,
            until: pointRange.until,
          },
        });
      }
    }

    // Data fetching

    function fetchAdminDashboard() {
      adminApi.getFullWorkitemHistory().then((response) => {
        workitemsHistory.value = response.data;
      });

      adminApi.getFullErrorsHistory().then((response) => {
        errorsHistory.value = response.data;
      });
      adminApi.getAdminCounts().then((response) => {
        counts.value = response.data;
      });
    }

    onMounted(() => {
      fetchAdminDashboard();
    });

    return {
      errorsHistory,
      errorsHistoryData,
      workitemsHistory,
      workitemsHistoryData,
      counts,
      errorHistoryPointClickHandler,
      workitemHistoryPointClickHandler,
    };
  },
});
</script>
