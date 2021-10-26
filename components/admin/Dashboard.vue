<template>
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter } from '@nuxtjs/composition-api'
import { HistoryItem } from '~/interfaces/common'
import { HistoryPointEvent } from '~/interfaces/charts'
import fetchAdmin from '@/helpers/fetch/fetchAdmin'
import { getPointDateRange } from '@/helpers/utils/chartUtils'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { fetchWorkItemsHistory, fetchErrorsHistory } = fetchAdmin()

    const errorsHistory = ref<HistoryItem[]>()
    const workitemsHistory = ref<HistoryItem[]>()

    function fetchHistories() {
      fetchWorkItemsHistory(null, null).then((response: HistoryItem[]) => {
        workitemsHistory.value = response
      })
      fetchErrorsHistory(null, null).then((response: HistoryItem[]) => {
        errorsHistory.value = response
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
      fetchHistories()
    })

    return {
      errorsHistory,
      workitemsHistory,
      errorHistoryPointClickHandler,
      workitemHistoryPointClickHandler,
    }
  },
})
</script>
