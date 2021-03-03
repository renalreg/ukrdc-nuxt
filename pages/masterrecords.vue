<template>
  <div>
    <SearchBar v-model="searchString" :focus="true" @submit="searchSubmit" />
    <div v-if="masterrecords.length > 0">
      <div v-for="item in masterrecords" :key="item.id">
        {{ item }}
      </div>
    </div>
    <div v-else>Start a search to view records</div>
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
      searchString: '',
    }
  },
  async fetch() {
    this.search = this.$route.query.search as string[]
    console.log(this.search)
    if (this.search.length > 0) {
      // Set the search string
      this.searchString = this.buildSearchStringFromQueryArray()
      // Build our query string from search terms and page info
      const path = `/empi/search/masterrecords?${this.buildQueryStringFromArray()}&page=${
        this.page
      }&size=${this.size}`
      // Fetch the search results from our API server
      const res: MasterRecordPage = await this.$axios.$get(path)
      console.log(res)
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
    searchSubmit(): void {
      // Build a search query from our search string
      this.search = this.buildQueryArrayFromSearchString()
      // Navigate to the search query path
      this.$router.push({
        path: this.$route.path,
        query: { search: this.search },
      })
    },
    buildQueryArrayFromSearchString(): string[] {
      // Builds an array of strings from a search bar string.
      // e.g. 'john & 1970-03-01' becomes ['john', '1949-03-01']
      const sections: string[] = this.searchString.split('&')
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
    buildQueryStringFromArray(): string {
      // Builds a query string from an array of strings.
      // e.g. ['john', '1949-03-01'] becomes search=john&search=1949-03-01
      if (Array.isArray(this.search)) {
        let q = ''
        for (const term of this.search) {
          q = q.concat(`search=${term}&`)
        }
        return q.slice(0, -1) // Remove trailing '&'
      } else {
        return `search=${this.search}`
      }
    },
  },
})
</script>
