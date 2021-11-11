<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Codes List</h1>
    </div>

    <div v-if="standards && standards.length > 1" :class="$route.params.id ? 'hidden lg:block' : 'block'">
      <GenericSearchableSelect
        v-model="selectedStandard"
        class="mb-4"
        :options="standards"
        hint="Select a coding standard..."
        :mount-opened="false"
        :closable="true"
      />
    </div>

    <div>
      <SearchBar v-model="searchboxString" :focus="false" :show-button="false" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Code list -->
      <div :class="$route.params.id ? 'hidden lg:block' : 'block'">
        <GenericCard>
          <!-- Skeleton results -->
          <ul v-if="fetchInProgress" class="divide-y divide-gray-200">
            <SkeleListItem v-for="n in 10" :key="n" />
          </ul>
          <!-- Real results -->
          <ul v-else class="divide-y divide-gray-200">
            <div v-for="code in codes" :key="`${code.codingStandard}.${code.code}`">
              <NuxtLink :to="{ path: `/codes/${code.codingStandard}.${code.code}/`, query: $route.query }">
                <CodesListItem class="hover:bg-gray-50" :code="code" />
              </NuxtLink>
            </div>
          </ul>
          <GenericPaginator
            class="bg-white border-t border-gray-200"
            :page="page"
            :size="size"
            :total="total"
            @next="page++"
            @prev="page--"
            @jump="page = $event"
          />
        </GenericCard>
      </div>
      <!-- Code details -->
      <div>
        <GenericButton
          v-show="$route.params.id"
          class="lg:hidden mb-4 w-full"
          :to="{ path: `/codes/`, query: $route.query }"
          >Back to List</GenericButton
        >
        <GenericCard class="pt-4" :class="$route.params.id ? 'block' : 'hidden lg:block'">
          <NuxtChild />
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'

import { Code } from '@/interfaces/codes'
import useQuery from '~/helpers/query/useQuery'
import usePagination from '~/helpers/query/usePagination'
import fetchCodes from '~/helpers/fetch/fetchCodes'

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination()
    const { stringQuery } = useQuery()
    const { fetchCodingStandards, fetchCodesPage, fetchInProgress } = fetchCodes()

    // Data refs

    const standards = ref<string[]>()
    const selectedStandard = stringQuery('standard', null, true, true)

    const codes = ref([] as Code[])
    const selectedCode = ref<Code>()

    const searchboxString = stringQuery('search', null, true, true)

    // Data fetching
    async function getCodes() {
      const codesPage = await fetchCodesPage(page.value || 0, size.value, selectedStandard.value, searchboxString.value)
      codes.value = codesPage.items
      total.value = codesPage.total
      page.value = codesPage.page
      size.value = codesPage.size
    }

    onMounted(async () => {
      standards.value = await fetchCodingStandards()
      getCodes()
    })

    watch([page, selectedStandard, searchboxString], (curr, prev) => {
      // When we change page, the query object gets written to,
      // triggering this event even if the values themselves
      // don't change. We need to compare them before deciding
      // to fetch, otherwise the list of codes will refresh
      // every time you click on a code and change page.
      if (!(curr[0] === prev[0] && curr[1] === prev[1] && curr[2] === prev[2])) {
        getCodes()
      }
    })

    return {
      standards,
      selectedStandard,
      codes,
      selectedCode,
      searchboxString,
      getCodes,
      fetchInProgress,
      page,
      total,
      size,
    }
  },
  head: {
    title: 'Code List',
  },
})
</script>
