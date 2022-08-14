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
        <GenericCardContent class="p-4">
          <ChartTimeSeries
            id="error-history-time-series"
            class="h-64"
            :data="errorsHistory"
            y-label="New Errors"
            @click="errorHistoryPointClickHandler"
          />
        </GenericCardContent>
      </GenericCard>
      <!-- WorkItems history -->
      <GenericCard v-if="workitemsHistory">
        <GenericCardHeader>
          <TextH2> Work Items History </TextH2>
        </GenericCardHeader>
        <GenericCardContent class="p-4">
          <ChartTimeSeries
            id="workitem-history-time-series"
            class="h-64"
            :data="workitemsHistory"
            y-label="New Work Items"
            @click="workitemHistoryPointClickHandler"
          />
        </GenericCardContent>
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { AdminCountsSchema, HistoryPoint } from "@ukkidney/ukrdc-axios-ts";
import { HistoryPointEvent } from "~/interfaces/charts";
import useApi from "~/helpers/useApi";
import { getPointDateRange } from "~/helpers/utils/chartUtils";

export default defineComponent({
  setup() {
    const router = useRouter();
    const { adminApi } = useApi();

    const errorsHistory = ref<HistoryPoint[]>();
    const workitemsHistory = ref<HistoryPoint[]>();
    const counts = ref<AdminCountsSchema>();

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

    // History plot click handler

    function errorHistoryPointClickHandler(point: HistoryPointEvent) {
      const pointRange = getPointDateRange(point);
      router.push({
        path: "/messages",
        query: {
          since: pointRange.since,
          until: pointRange.until,
          status: ["ERROR", "RESOLVED"],
        },
      });
    }

    function workitemHistoryPointClickHandler(point: HistoryPointEvent) {
      const pointRange = getPointDateRange(point);
      router.push({
        path: "/workitems",
        query: {
          since: pointRange.since,
          until: pointRange.until,
        },
      });
    }

    onMounted(() => {
      fetchAdminDashboard();
    });

    return {
      errorsHistory,
      workitemsHistory,
      counts,
      errorHistoryPointClickHandler,
      workitemHistoryPointClickHandler,
    };
  },
});
</script>
