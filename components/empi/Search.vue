<!--
Mini (half-width) search bar and results pages used in the EMPI Merge page.
-->

<template>
  <div>
    <div class="mb-4">
      <SearchBar v-model="searchboxString" :focus="true" :show-button="false" @submit="searchSubmit" />
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
            <MasterrecordsListItem
              class="cursor-pointer"
              :item="item"
              :show-record-id="false"
              @click.native="$emit('select', item.id)"
            />
          </div>
        </ul>
        <GenericPaginator
          class="bg-white border-t border-gray-200"
          :page="page"
          :size="size"
          :total="total"
          :show-pages="false"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'

import usePagination from '~/helpers/query/usePagination'
import { MasterRecord } from '@/interfaces/masterrecord'

import useUserPrefs from '~/helpers/useUserPrefs'
import useRecordSearch from '~/helpers/query/useRecordSearch'

import fetchSearchResults from '~/helpers/fetch/fetchSearchResults'

export default defineComponent({
  props: {
    onlyUkrdc: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute()

    const { page, total, size } = usePagination()
    const { showUKRDC } = useUserPrefs()
    const { searchQueryIsPopulated, searchboxString, searchSubmit, apiQueryString } = useRecordSearch()
    const { fetchSearchResultsPage, searchInProgress } = fetchSearchResults()

    const masterrecords = ref([] as MasterRecord[])

    async function fetchResults() {
      if (searchQueryIsPopulated) {
        const results = await fetchSearchResultsPage(
          apiQueryString.value,
          page.value || 1,
          size.value,
          true,
          props.onlyUkrdc
        )

        masterrecords.value = results.items
        total.value = results.total
        page.value = results.page
        size.value = results.size
      }
    }

    onMounted(() => {
      fetchResults()
    })

    watch([route, showUKRDC], () => {
      fetchResults()
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
