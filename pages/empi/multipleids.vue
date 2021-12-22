<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <TextH1>Multiple UKRDC IDs</TextH1>
    </div>
    <div v-if="groups">
      <div v-for="(group, index) in groups" :key="`group-${index}`">
        <GenericCard class="mb-6">
          <ul class="divide-y divide-gray-200">
            <div v-for="item in group" :key="item.id" class="hover:bg-gray-50">
              <NuxtLink :to="`/masterrecords/${item.id}`">
                <MasterrecordsListItem :item="item" />
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'

import { MasterRecord } from '@/interfaces/masterrecord'
import usePagination from '~/helpers/query/usePagination'

import fetchDataHealth from '~/helpers/fetch/fetchDataHealth'

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination()
    const { fetchMultipleUKRDCIDsPage } = fetchDataHealth()

    // Data refs
    size.value = 10 // Get 10 groups as we expect a couple of records per group
    const groups = ref<MasterRecord[][]>()

    // Data fetching
    async function getGroups() {
      const groupsPage = await fetchMultipleUKRDCIDsPage(page.value || 1, size.value)
      groups.value = groupsPage.items
      total.value = groupsPage.total
      page.value = groupsPage.page
      size.value = groupsPage.size
    }

    onMounted(() => {
      getGroups()
    })

    watch(page, () => {
      getGroups()
    })

    return {
      groups,
      page,
      total,
      size,
    }
  },
})
</script>
