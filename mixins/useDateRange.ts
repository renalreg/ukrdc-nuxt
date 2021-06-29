import { useRoute, useRouter, computed } from '@nuxtjs/composition-api'

import { DateRange } from '@/utilities/dateUtils'
import { singleQuery } from '@/utilities/queryUtils'

export default function () {
  const route = useRoute()
  const router = useRouter()

  function makeDateRange(defaultStart: string | null, defaultEnd: string | null, resetPage: boolean = true) {
    return computed({
      get: () => {
        return {
          start: singleQuery(route.value.query.since) || defaultStart,
          end: singleQuery(route.value.query.until) || defaultEnd,
        }
      },
      set(newRange: DateRange) {
        console.log('Setting dateRange')
        if (!newRange) {
          return
        }

        const newQuery = Object.assign({}, route.value.query, {
          since: newRange.start,
          until: newRange.end,
        })

        if (resetPage) {
          // If we use both date and page to filter, we need to
          // reset the page number
          if (newQuery.page) {
            newQuery.page = '0'
          }
        }

        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })
  }

  return {
    makeDateRange,
  }
}
