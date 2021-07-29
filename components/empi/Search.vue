<template>
  <div>
    <div class="mb-4">
      <SearchBar v-model="searchboxString" :focus="true" @submit="searchSubmit" />
    </div>

    <div v-if="masterrecords.length > 0">
      <GenericCard>
        <!-- Skeleton results -->
        <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
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
          v-if="!$fetchState.pending"
          class="bg-white border-t border-gray-200"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
        />
      </GenericCard>
    </div>
    <div v-else class="mt-2 text-gray-500 text-center">
      <LoadingIndicator v-if="searchQueryIsPopulated && $fetchState.pending"></LoadingIndicator>
      <div v-else-if="searchQueryIsPopulated && !$fetchState.pending">No results found</div>
      <div v-else>
        <p class="mb-4">Search by name, date of birth, national ID, or local ID</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, useRoute, useFetch, useContext } from '@nuxtjs/composition-api'

import usePagination from '@/mixins/usePagination'
import { MasterRecord } from '@/interfaces/masterrecord'

import useUserPrefs from '~/mixins/useUserPrefs'
import useRecordSearch from '~/mixins/useRecordSearch'

interface MasterRecordPage {
  items: MasterRecord[]
  total: number
  page: number
  size: number
}

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

    const { $axios, $config } = useContext()
    const { page, total, size } = usePagination()
    const { showUKRDC } = useUserPrefs()
    const { searchQueryIsPopulated, searchboxString, searchSubmit, apiQueryString } = useRecordSearch()

    const masterrecords = ref([] as MasterRecord[])

    const { fetch } = useFetch(async () => {
      // search.value = route.value.query.search as string[]
      if (searchQueryIsPopulated) {
        // Fetch the search results from our API server
        let path = `${$config.apiBase}/v1/search/?${apiQueryString.value}&page=${page.value}&size=${size.value}&include_ukrdc=true`
        if (props.onlyUkrdc) {
          path = path + `&only_ukrdc=1`
        }
        const res: MasterRecordPage = await $axios.$get(path)
        masterrecords.value = res.items
        total.value = res.total
        page.value = res.page
        size.value = res.size
      }
    })

    watch([route, showUKRDC], () => {
      fetch()
    })

    return {
      masterrecords,
      searchboxString,
      showUKRDC,
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
