<template>
  <div>
    <div class="max-w-7xl mx-auto mb-6">
      <TextH1>Multiple UKRDC IDs</TextH1>
      <TextP>Results of a scan that detect patients with more than one UKRDC Master Record.</TextP>
      <TextP>
        New results are identified weekly, but existing results are re-checked hourly, see <b>Last checked</b>.
      </TextP>
      <TextP> Resolved items will remain in this view until the next check. </TextP>
    </div>

    <div v-if="groups">
      <div v-for="group in groups" :key="`group-${group.groupId}`">
        <GenericCard class="mb-8">
          <ul class="divide-y divide-gray-200">
            <div
              v-for="item in group.records"
              :key="`record-${group.groupId}-${item.masterRecord.id}`"
              class="hover:bg-gray-50"
            >
              <SkeleListItem v-if="fetchInProgress" />
              <NuxtLink v-else :to="`/masterrecords/${item.masterRecord.id}`">
                <MasterrecordsListItem
                  :item="item.masterRecord"
                  details-label="Last checked"
                  :details-value="formatDate(item.lastUpdated)"
                />
              </NuxtLink>
            </div>
          </ul>
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

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination()
    const { fetchMultipleUKRDCIDsPage } = fetchDataHealth()

    // Data refs
    size.value = 10 // Get 10 groups as we expect a couple of records per group

    const groups = ref<MultipleUKRDCIDsGroup[]>()
    const fetchInProgress = ref(false)

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
    })

    watch(page, () => {
      getGroups()
    })

    return {
      groups,
      fetchInProgress,
      page,
      total,
      size,
      formatDate,
    }
  },
})
</script>
