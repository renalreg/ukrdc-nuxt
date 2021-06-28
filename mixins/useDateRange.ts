import { ref, useRoute, useRouter, computed } from '@nuxtjs/composition-api'

import { nowString, DateRange } from '@/utilities/dateUtils'
import { singleQuery } from '@/utilities/queryUtils'

export default function () {
  const route = useRoute()
  const router = useRouter()

  const since = ref((singleQuery(route.value.query.since) || null) as string)
  const until = ref((singleQuery(route.value.query.until) || nowString(0)) as string)
  const range = computed({
    get: () => {
      return {
        start: since.value,
        end: since.value,
      }
    },
    set(newRange: DateRange) {
      if (!newRange) {
        return
      }
      since.value = newRange.start
      until.value = newRange.end

      const newQuery = Object.assign({}, route.value.query, {
        since: since.value,
        until: until.value,
      })

      // If we use both date and page to filter, we need to
      // reset the page number
      if (newQuery.page) {
        newQuery.page = '0'
      }

      router.push({
        path: route.value.path,
        query: newQuery,
      })
    },
  })

  return {
    range,
    since,
    until,
  }
}
