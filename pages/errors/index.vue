<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Errors</h1>
    </div>

    <div class="bg-white shadow overflow-hidden rounded-md">
      <!-- Skeleton results -->
      <ul v-if="$fetchState.pending" class="divide-y divide-gray-200">
        <workitemsListItemPlaceholder v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <errorsListItem v-for="item in messages" :key="item.id" :item="item" />
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
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import { Message } from '@/interfaces/errors'

interface MessagePage {
  items: Message[]
  total: number
  page: number
  size: number
}

export default Vue.extend({
  mixins: [dateUtilsMixin],
  data() {
    return {
      messages: [] as Message[],
      total: 0,
      page: (this.$route.query.page || 0) as Number,
      size: 20,
    }
  },
  async fetch() {
    // Fetch the dashboard response from our API server
    const res: MessagePage = await this.$axios.$get(
      `/api/errors?status=ERROR&page=${this.page}&size=${this.size}`
    )
    this.messages = res.items
    this.total = res.total
    this.page = res.page
    this.size = res.size
  },
  head() {
    return {
      title: 'Mirth Errors',
    }
  },
  watch: {
    // We want to re-trigger the query if the route query changes,
    // E.g. changing page or browser navigation
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
  },
})
</script>
