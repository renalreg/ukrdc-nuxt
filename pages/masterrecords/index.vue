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
        <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
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
      <LoadingIndicator v-if="activeSearch && $fetchState.pending"></LoadingIndicator>
      <div v-else-if="activeSearch && !$fetchState.pending">No results found</div>
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
import {
  defineComponent,
  watch,
  ref,
  useRoute,
  useFetch,
  useContext,
  computed,
  useStore,
} from '@nuxtjs/composition-api'

import usePagination from '@/mixins/usePagination'
import { MasterRecord } from '@/interfaces/masterrecord'
import useQuery from '~/mixins/useQuery'

interface MasterRecordPage {
  items: MasterRecord[]
  total: number
  page: number
  size: number
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const store = useStore()

    const { $axios, $config } = useContext()
    const { page, total, size } = usePagination()
    const { arrayQuery } = useQuery()

    const masterrecords = ref([] as MasterRecord[])

    const search = arrayQuery('search', [], true, true)
    const searchboxString = ref('')
    const activeSearch = computed(() => {
      if (search.value && search.value.length > 0) {
        return true
      }
      return false
    })

    const showUKRDC = computed({
      get: () => {
        return store.getters.searchShowUKRDC
      },
      set: (newValue: boolean) => {
        store.commit('changeSearchShowUKRDC', newValue)
      },
    })

    const { fetch } = useFetch(async () => {
      // search.value = route.value.query.search as string[]
      if (search.value && search.value.length > 0) {
        // Set the search string
        searchboxString.value = buildSearchStringFromQueryArray()
        // Build our query string from search terms and page info
        let path = `${$config.apiBase}/v1/search/?${buildQueryStringFromArray(search.value, 'search')}&page=${
          page.value
        }&size=${size.value}`
        if (showUKRDC.value) {
          path = path + '&include_ukrdc=true'
        }
        // Fetch the search results from our API server
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

    function searchSubmit(): void {
      // Build a search query from our search string
      search.value = buildQueryArrayFromSearchString()
    }

    function buildQueryArrayFromSearchString(): string[] {
      // Builds an array of strings from a search bar string.
      // e.g. 'john & 1970-03-01' becomes ['john', '1949-03-01']
      const sections: string[] = searchboxString.value.split('&')
      return sections.map(function (s: string) {
        return s.trim()
      })
    }

    function buildSearchStringFromQueryArray(): string {
      // Builds a search bar string from an array of strings.
      // e.g. ['john', '1949-03-01'] becomes john & 1949-03-01
      if (Array.isArray(search.value)) {
        let q = ''
        for (const term of search.value) {
          q = q.concat(`${term} & `)
        }
        return q.slice(0, -3) // Remove trailing ' & '
      } else {
        return search.value
      }
    }

    function buildQueryStringFromArray(input: (string | null)[] | string, queryName: string): string {
      // Builds a query string from an array of strings.
      // e.g. ['john', '1949-03-01'] becomes search=john&search=1949-03-01
      if (Array.isArray(input)) {
        let q = ''
        for (const term of input) {
          q = q.concat(`${queryName}=${term}&`)
        }
        return q.slice(0, -1) // Remove trailing '&'
      } else {
        return `${queryName}=${input}`
      }
    }

    return {
      masterrecords,
      searchboxString,
      showUKRDC,
      searchSubmit,
      search,
      activeSearch,
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
