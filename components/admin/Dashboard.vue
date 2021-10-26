<template>
  <div>
    <div v-if="counts" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <GenericCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconUsers />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <GenericCardDt>Total UKRDC Records</GenericCardDt>
              <dd>
                <TextHc>{{ counts.UKRDCRecords }}</TextHc>
              </dd>
            </dl>
          </div>
        </div>
        <div class="bg-gray-50 text-gray-500 px-4 py-2 text-sm">Total distinct UKRDC IDs in the database</div>
      </GenericCard>

      <GenericCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconExclamation />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <GenericCardDt>Active Failing Records</GenericCardDt>
              <dd>
                <h1
                  class="text-2xl font-semibold"
                  :class="counts.patientsReceivingErrors > 0 ? 'text-red-600' : 'text-green-600'"
                >
                  {{ counts.patientsReceivingErrors }}
                </h1>
              </dd>
            </dl>
          </div>
        </div>
        <div class="bg-gray-50 text-gray-500 px-4 py-2 text-sm">
          Records with active data files currently failing due to errors
        </div>
      </GenericCard>

      <GenericCard>
        <div class="flex items-center p-4">
          <div class="flex-shrink-0">
            <IconLink />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <GenericCardDt>Open Work Items</GenericCardDt>
              <dd>
                <h1
                  class="text-2xl font-semibold"
                  :class="counts.openWorkitems > 0 ? 'text-yellow-600' : 'text-green-600'"
                >
                  {{ counts.openWorkitems }}
                </h1>
              </dd>
            </dl>
          </div>
        </div>
        <div class="bg-gray-50 text-gray-500 px-4 py-2 text-sm">Work Items currently open or WIP</div>
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
            label="New Errors"
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
            label="New Work Items"
            @click="workitemHistoryPointClickHandler"
          />
        </GenericCardContent>
      </GenericCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter } from '@nuxtjs/composition-api'
import { HistoryItem } from '~/interfaces/common'
import { HistoryPointEvent } from '~/interfaces/charts'
import fetchAdmin from '@/helpers/fetch/fetchAdmin'
import { getPointDateRange } from '@/helpers/utils/chartUtils'
import { AdminCounts } from '~/interfaces/admin'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { fetchWorkItemsHistory, fetchErrorsHistory, fetchAdminCounts } = fetchAdmin()

    const errorsHistory = ref<HistoryItem[]>()
    const workitemsHistory = ref<HistoryItem[]>()
    const counts = ref<AdminCounts>()

    function fetchAdminDashboard() {
      fetchWorkItemsHistory(null, null).then((response: HistoryItem[]) => {
        workitemsHistory.value = response
      })
      fetchErrorsHistory(null, null).then((response: HistoryItem[]) => {
        errorsHistory.value = response
      })
      fetchAdminCounts().then((response: AdminCounts) => {
        counts.value = response
      })
    }

    // History plot click handler

    function errorHistoryPointClickHandler(point: HistoryPointEvent) {
      const pointRange = getPointDateRange(point)
      router.push({
        path: '/messages',
        query: {
          since: pointRange.since,
          until: pointRange.until,
          status: ['ERROR', 'RESOLVED'],
        },
      })
    }

    function workitemHistoryPointClickHandler(point: HistoryPointEvent) {
      const pointRange = getPointDateRange(point)
      router.push({
        path: '/workitems',
        query: {
          since: pointRange.since,
          until: pointRange.until,
        },
      })
    }

    onMounted(() => {
      fetchAdminDashboard()
    })

    return {
      errorsHistory,
      workitemsHistory,
      counts,
      errorHistoryPointClickHandler,
      workitemHistoryPointClickHandler,
    }
  },
})
</script>
