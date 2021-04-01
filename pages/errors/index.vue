<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Errors</h1>
    </div>

    <div class="mb-4">
      <client-only>
        <v-date-picker
          v-model="range"
          :model-config="modelConfig"
          color="indigo"
          is-range
        >
          <template #default="{ inputValue, inputEvents }">
            <div class="flex items-center">
              <input
                type="text"
                :value="inputValue.start"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                v-on="inputEvents.start"
              />
              <svg
                class="w-4 h-4 mx-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <input
                type="text"
                :value="inputValue.end"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                v-on="inputEvents.end"
              />
            </div>
          </template>
        </v-date-picker>
      </client-only>
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
import { singleQuery } from '@/utilities/queryUtils'

import dateUtilsMixin from '@/mixins/dateutils'
import { Message } from '@/interfaces/errors'

interface DateRange {
  start: string
  end: string
}

interface MessagePage {
  items: Message[]
  total: number
  page: number
  size: number
}

function todayString(addDays: number = 0): string {
  const today = new Date()
  today.setDate(today.getDate() + addDays)
  return (
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  )
}

export default Vue.extend({
  mixins: [dateUtilsMixin],
  data() {
    return {
      messages: [] as Message[],
      total: 0,
      page: (singleQuery(this.$route.query.page) || 0) as number,
      size: 20,
      since: (singleQuery(this.$route.query.since) ||
        todayString(-7)) as string,
      until: (singleQuery(this.$route.query.until) || todayString(0)) as string,
      modelConfig: {
        start: {
          type: 'string',
          mask: 'YYYY-MM-DD',
        },
        end: {
          type: 'string',
          mask: 'YYYY-MM-DD',
        },
      },
    }
  },
  async fetch() {
    // Fetch the dashboard response from our API server
    let path = `/api/errors?status=ERROR&page=${this.page}&size=${this.size}`
    if (this.since) {
      path = path + `&since=${this.since}`
    }
    // Pass `until` to API if it's given
    if (this.until) {
      path = path + `&until=${this.until}`
    } else if (this.since) {
      // If no `until` is given but a `since` is given, then a single date is selected
      // In this case we want to only show that one day, not a range
      path = path + `&until=${this.since}`
    }
    const res: MessagePage = await this.$axios.$get(path)
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
  computed: {
    today(): string {
      return todayString(0)
    },
    dateRange: {
      get(): string[] {
        return [this.since, this.until]
      },
      set(newRange: string[]) {
        this.since = newRange[0]
        this.until = newRange[1]

        const newQuery = Object.assign({}, this.$route.query, {
          since: this.since,
          until: this.until,
        })
        this.$router.push({
          path: this.$route.path,
          query: newQuery,
        })
      },
    },
    range: {
      get(): DateRange {
        return {
          start: this.since,
          end: this.until,
        }
      },
      set(newRange: DateRange) {
        this.since = newRange.start
        this.until = newRange.end

        const newQuery = Object.assign({}, this.$route.query, {
          since: this.since,
          until: this.until,
        })
        this.$router.push({
          path: this.$route.path,
          query: newQuery,
        })
      },
    },
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
