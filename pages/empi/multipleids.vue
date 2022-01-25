<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <TextH1>Multiple UKRDC IDs</TextH1>
      <TextP>Results of a scan that detect patients with more than one UKRDC Master Record.</TextP>
    </div>

    <!-- Description list -->
    <GenericCard class="mb-6">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Patients with Multiple UKRDC IDs</TextDt>
            <TextDd v-if="total">
              {{ total }}
            </TextDd>
            <SkeleText v-else class="mt-2 h-6 w-8" />
          </GenericDi>

          <GenericDi>
            <TextDt class="flex items-center gap-1">
              <span class="inline">Last Full Scan</span>
              <GenericInfoIcon class="inline">
                <p>
                  New results are identified weekly by a <b>Full Scan</b>, but existing results are re-checked hourly,
                  see <b>Last checked</b>.
                </p>
                <p>Resolved items will remain in this view until the next check.</p>
              </GenericInfoIcon>
            </TextDt>
            <TextDd v-if="lastRunTime">
              {{ formatDate(lastRunTime, true) }}
            </TextDd>
            <SkeleText v-else class="mt-2 h-6 w-1/4" />
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <div v-if="groups">
      <div v-for="group in groups" :key="`group-${group.groupId}`">
        <GenericCard class="mb-4">
          <empiMultipleIDItem :group="group" :fetch-in-progress="fetchInProgress" />
        </GenericCard>
      </div>

      <GenericCard>
        <GenericPaginator
          class="bg-white"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </GenericCard>
    </div>
    <LoadingIndicator v-else></LoadingIndicator>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'

import { MultipleUKRDCIDsGroup } from '@/interfaces/datahealth'
import usePagination from '~/helpers/query/usePagination'

import fetchDataHealth from '~/helpers/fetch/fetchDataHealth'
import { LastRunTime } from '~/interfaces/admin'

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination()
    const { fetchMultipleUKRDCIDsPage, fetchMultipleUKRDCIDsLastRun } = fetchDataHealth()

    // Data refs
    size.value = 10 // Get 10 groups as we expect a couple of records per group

    const groups = ref<MultipleUKRDCIDsGroup[]>()
    const fetchInProgress = ref(false)

    const lastRunTime = ref<string>()

    // Data fetching
    async function getGroups() {
      fetchInProgress.value = true

      const groupsPage = await fetchMultipleUKRDCIDsPage(page.value || 1, size.value)
      groups.value = groupsPage.items
      total.value = groupsPage.total
      page.value = groupsPage.page
      size.value = groupsPage.size

      fetchInProgress.value = false
    }

    onMounted(() => {
      getGroups()
      fetchMultipleUKRDCIDsLastRun().then((response: LastRunTime) => {
        console.log(response)
        lastRunTime.value = response.lastRunTime
      })
    })

    watch(page, () => {
      getGroups()
    })

    return {
      groups,
      fetchInProgress,
      lastRunTime,
      page,
      total,
      size,
      formatDate,
    }
  },
})
</script>
