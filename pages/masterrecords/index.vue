<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <SearchBar
      v-model="searchboxString"
      class="mb-4"
      :focus="true"
      @submit="searchSubmit"
    />
    <div v-if="masterrecords.length > 0">
      <div class="bg-white shadow overflow-hidden rounded-md">
        <!-- Skeleton results -->
        <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
          <masterrecordsListItemPlaceholder v-for="n in 10" :key="n" />
        </ul>
        <!-- Real results -->
        <ul v-else class="divide-y divide-gray-200">
          <masterrecordsListItem
            v-for="item in masterrecords"
            :key="item.id"
            :item="item"
          />
        </ul>
        <paginator
          v-if="!$fetchState.pending"
          class="bg-white border-t border-gray-200"
          :page="page"
          :size="size"
          :total="total"
          @next="changePage(page + 1)"
          @prev="changePage(page - 1)"
        />
      </div>
    </div>
    <div v-else class="mt-2 text-sm text-gray-500 text-center">
      {{
        search && !$fetchState.pending
          ? 'No results found'
          : 'Start a search to view records'
      }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { MasterRecord } from '@/interfaces/masterrecords'

interface MasterRecordPage {
  items: MasterRecord[]
  total: number
  page: number
  size: number
}

export default Vue.extend({
  props: {},
  data() {
    return {
      masterrecords: [] as MasterRecord[],
      total: 0,
      page: (this.$route.query.page || 0) as number,
      size: 20,
      search: (this.$route.query.search || []) as string[],
      numberType: (this.$route.query.number_type || ['UKRDC']) as string[],
      searchboxString: '',
    }
  },
  async fetch() {
    this.search = this.$route.query.search as string[]
    if (this.search && this.search.length > 0) {
      // Set the search string
      this.searchboxString = this.buildSearchStringFromQueryArray()
      // Build our query string from search terms and page info
      const path = `/api/empi/search/masterrecords?${this.buildQueryStringFromArray(
        this.search,
        'search'
      )}&${this.buildQueryStringFromArray(
        this.numberType,
        'number_type'
      )}&page=${this.page}&size=${this.size}`
      // Fetch the search results from our API server
      const res: MasterRecordPage = await this.$axios.$get(path)
      this.masterrecords = res.items
      this.total = res.total
      this.page = res.page
      this.size = res.size
    }
  },
  head() {
    return {
      title: 'Master Records',
    }
  },
  watch: {
    // We want to re-trigger a search if the route query changes,
    // E.g. a user navigates back in their browser without refreshing
    '$route.query': '$fetch',
  },
  methods: {
    changePage(newPage: number): void {
      this.page = newPage
      const newQuery = Object.assign({}, this.$route.query, {
        page: newPage.toString(),
      })
      this.$router.push({
        path: this.$route.path,
        query: newQuery,
      })
    },
    searchSubmit(): void {
      // Build a search query from our search string
      this.search = this.buildQueryArrayFromSearchString()
      // Reset page
      this.page = 0
      // Navigate to the search query path
      this.$router.push({
        path: this.$route.path,
        query: { search: this.search, number_type: this.numberType },
      })
    },
    buildQueryArrayFromSearchString(): string[] {
      // Builds an array of strings from a search bar string.
      // e.g. 'john & 1970-03-01' becomes ['john', '1949-03-01']
      const sections: string[] = this.searchboxString.split('&')
      return sections.map(function (s: string) {
        return s.trim()
      })
    },
    buildSearchStringFromQueryArray(): string {
      // Builds a search bar string from an array of strings.
      // e.g. ['john', '1949-03-01'] becomes john & 1949-03-01
      if (Array.isArray(this.search)) {
        let q = ''
        for (const term of this.search) {
          q = q.concat(`${term} & `)
        }
        return q.slice(0, -3) // Remove trailing ' & '
      } else {
        return this.search
      }
    },
    buildQueryStringFromArray(
      input: string[] | string,
      queryName: string
    ): string {
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
    },
  },
})
</script>
