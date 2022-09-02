<!--
Admin (permission ukrdc:facilities:*) dashboard with overview of all facilities.
-->

<template>
  <div>
    <div v-if="counts" class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <GenericCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconUsers />
          </div>
          <div class="ml-5 w-0 flex-1">
            <TextL1>Total UKRDC Records</TextL1>
            <h1 class="text-2xl font-semibold text-green-600">{{ counts.UKRDCRecords }}</h1>
          </div>
        </div>
        <GenericCardFooter>Total distinct UKRDC IDs in the database</GenericCardFooter>
      </GenericCard>

      <GenericCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconLink />
          </div>
          <div class="ml-5 w-0 flex-1">
            <TextL1>Open Work Items</TextL1>
            <h1 class="text-2xl font-semibold" :class="counts.openWorkitems > 0 ? 'text-yellow-600' : 'text-green-600'">
              {{ counts.openWorkitems }}
            </h1>
          </div>
        </div>
        <GenericCardFooter>Work Items currently open or WIP</GenericCardFooter>
      </GenericCard>

      <GenericCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconExclamation />
          </div>
          <div class="ml-5 w-0 flex-1">
            <TextL1>Active Failing Records</TextL1>
            <h1
              class="text-2xl font-semibold"
              :class="counts.patientsReceivingErrors > 0 ? 'text-red-600' : 'text-green-600'"
            >
              {{ counts.patientsReceivingErrors }}
            </h1>
          </div>
        </div>
        <GenericCardFooter>Records with active data files currently failing due to errors </GenericCardFooter>
      </GenericCard>
    </div>
    <!-- Graphs -->
    <div class="flex flex-col gap-4">
      <!-- Error history -->
      <GenericCard v-if="errorsHistory">
        <GenericCardHeader>
          <TextH2> Error History </TextH2>
        </GenericCardHeader>
        <PlotTimeSeries
          id="error-history-time-series"
          class="h-64"
          :x="errorsHistoryData.x"
          :y="errorsHistoryData.y"
          y-label="New Errors"
          @click="errorHistoryPointClickHandler"
        />
      </GenericCard>
      <!-- WorkItems history -->
      <GenericCard v-if="workitemsHistory">
        <GenericCardHeader>
          <TextH2> Work Items History </TextH2>
        </GenericCardHeader>
        <PlotTimeSeries
          id="workitem-history-time-series"
          class="h-64"
          :x="workitemsHistoryData.x"
          :y="workitemsHistoryData.y"
          y-label="New Work Items"
          @click="workitemHistoryPointClickHandler"
        />
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRouter } from "@nuxtjs/composition-api";
import { AdminCountsSchema, HistoryPoint } from "@ukkidney/ukrdc-axios-ts";
import { PlotDatum } from "plotly.js";
import useApi from "~/helpers/useApi";
import { getPointDateRange, unpackHistoryPoints } from "~/helpers/utils/chartUtils";

export default defineComponent({
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
