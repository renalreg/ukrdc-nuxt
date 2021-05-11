/* 
Builds computed properties with get and set methods.
Get will read from the current router query, and
set will change the current router query. 

Type conversion is handled via the various included
methods. E.g. boolearQuery will parse the query string
and return a boolean. 
*/

import { useRoute, useRouter, computed } from '@nuxtjs/composition-api'

import { singleQuery } from '@/utilities/queryUtils'

export default function () {
  const route = useRoute()
  const router = useRouter()

  function arrayQuery(queryKey: string) {
    return computed({
      get: (): (string | null)[] => {
        const val = route.value.query[queryKey]
        if (!Array.isArray(val)) {
          return [val]
        } else {
          return val
        }
      },
      set: (newValue: (string | null)[]) => {
        const newQuery = route.value.query
        newQuery[queryKey] = newValue
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })
  }

  function stringQuery(queryKey: string) {
    return computed({
      get: (): string | null => {
        return singleQuery(route.value.query[queryKey])
      },
      set: (newValue: string | null) => {
        const newQuery = Object.assign({}, route.value.query, {
          [queryKey]: [newValue],
        })
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })
  }

  function booleanQuery(queryKey: string) {
    return computed({
      get: (): boolean | null => {
        return singleQuery(route.value.query[queryKey]) === 'true'
      },
      set: (newValue: boolean | null) => {
        const newQuery = Object.assign({}, route.value.query, {
          [queryKey]: [newValue],
        })
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })
  }

  function integerQuery(queryKey: string, defaultValue: number | null = null) {
    return computed({
      get: (): number | null => {
        const val = singleQuery(route.value.query[queryKey])
        if (val) {
          return parseInt(val)
        }
        return defaultValue
      },
      set: (newValue: number | null) => {
        const newQuery = Object.assign({}, route.value.query, {
          [queryKey]: [newValue],
        })
        router.push({
          path: route.value.path,
          query: newQuery,
        })
      },
    })
  }

  return { integerQuery, booleanQuery, stringQuery, arrayQuery }
}
