<template>
  <div>
    <div class="mb-4">
      <SearchBar v-model="searchboxString" :focus="true" @submit="searchSubmit" />
      <GenericCollapseHeader label="Advanced">
        <div class="mt-2">
          <FormCheckbox v-model="showUKRDC" label="Show internal UKRDC records" />
        </div>
      </GenericCollapseHeader>
    </div>

    <div v-if="masterrecords.length > 0">
      <GenericCard>
        <!-- Skeleton results -->
        <ul v-if="searchInProgress" class="divide-y divide-gray-200">
          <SkeleListItem v-for="n in 10" :key="n" />
        </ul>
        <!-- Real results -->
        <ul v-else class="divide-y divide-gray-200">
          <div v-for="item in masterrecords" :key="item.id" class="hover:bg-gray-50">
            <NuxtLink :to="`/masterrecords/${item.id}`">
              <MasterrecordsListItem :item="item" />
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
    <div v-else class="mt-2 text-gray-500 text-center">
      <LoadingIndicator v-if="searchQueryIsPopulated && searchInProgress"></LoadingIndicator>
      <div v-else-if="searchQueryIsPopulated && !searchInProgress">No results found</div>
      <div v-else>
        <p class="mb-4">Search by name, date of birth, national ID, or local ID</p>
        <p><b>Tip: </b>Refine your search by joining terms,</p>
        <p class="mb-4">
          For example,
          <span class="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
            john && 1/12/1980
          </span>
        </p>
        <p>Search for an exact name using quote marks,</p>
        <p>
          For example,
          <span class="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800"> "jon" </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'

import { MasterRecord } from '@/interfaces/masterrecord'
import usePagination from '~/helpers/query/usePagination'

import useUserPrefs from '~/helpers/useUserPrefs'
import useRecordSearch from '~/helpers/query/useRecordSearch'

import fetchSearchResults from '~/helpers/fetch/fetchSearchResults'

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination()
    const { showUKRDC } = useUserPrefs()
    const { searchQueryIsPopulated, searchboxString, searchSubmit, apiQueryString } = useRecordSearch()
    const { fetchSearchResultsPage, searchInProgress } = fetchSearchResults()

    // Data refs

    const masterrecords = ref([] as MasterRecord[])

    // Data fetching

    async function getResults() {
      if (searchQueryIsPopulated.value) {
        const resultsPage = await fetchSearchResultsPage(
          apiQueryString.value,
          page.value || 1,
          size.value,
          showUKRDC.value
        )

        masterrecords.value = resultsPage.items
        page.value = resultsPage.page
        total.value = resultsPage.total
        size.value = resultsPage.size
      }
    }

    onMounted(() => {
      getResults()
    })

    watch([apiQueryString, page, showUKRDC], () => {
      getResults()
    })

    return {
      masterrecords,
      searchboxString,
      showUKRDC,
      searchInProgress,
      searchSubmit,
      searchQueryIsPopulated,
      page,
      size,
      total,
    }
  },
  head: {
    title: 'Master Records',
  },
})
</script>
