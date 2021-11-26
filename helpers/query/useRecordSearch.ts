import { computed, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'
import useQuery from '~/helpers/query/useQuery'

export default function () {
  const route = useRoute()

  const { arrayQuery } = useQuery()

  // Array of individual search terms as an array of strings from the URL query
  // This is the primary source for search terms when calling the API
  const searchTermArray = arrayQuery('search', [], true, true)

  // Current string value of the search text box
  const searchboxString = ref('')

  // Check if all terms in an array are empty
  function arrayIsEmpty(arr: (string | null)[]) {
    return arr.every((t) => {
      return !t
    })
  }

  // Check if there are currently any search terms in the URL query
  const searchQueryIsPopulated = computed(() => {
    if (
      // If searchTermArray is an array (rather than null or undefined)
      Array.isArray(searchTermArray.value) &&
      // And a value exists
      searchTermArray.value &&
      // And the value is not an empty array
      searchTermArray.value.length > 0 &&
      // And the array contains some non-null or empty items
      !arrayIsEmpty(searchTermArray.value)
    ) {
      return true
    }
    return false
  })

  function searchSubmit(): void {
    // Populates the 'search' URL query array from the search text box string.
    // e.g. 'john & 1970-03-01' becomes ['john', '1949-03-01']
    if (searchboxString.value) {
      const sections: string[] = searchboxString.value.split('&')
      searchTermArray.value = sections.map(function (s: string) {
        return s.trim()
      })
    }
  }

  function searchApply(): void {
    // Builds a search bar string from an array of strings.
    // e.g. ['john', '1949-03-01'] becomes john & 1949-03-01
    // Effectively the inverse of searchSubmit
    if (searchQueryIsPopulated) {
      let q = ''
      for (const term of searchTermArray.value) {
        q = q.concat(`${term} & `)
      }
      searchboxString.value = q.slice(0, -3) // Remove trailing ' & '
    } else {
      searchboxString.value = ''
    }
  }

  function buildAPIQueryStringFromArray(
    input: (string | null)[] | string,
    defaultQueryName: string = 'search'
  ): string {
    // Builds an API query string from an array of search terms.
    // e.g. ['john', '1949-03-01'] becomes search=john&search=1949-03-01

    if (Array.isArray(input)) {
      // If passed multiple query params as an array

      // Initial empty query
      let q = ''
      for (const term of input) {
        let queryName = defaultQueryName
        let queryValue: string

        if (term) {
          if (term.includes('=')) {
            // If the term contains a query name and value
            const splitTerm = term.split('=')
            queryName = splitTerm[0]
            queryValue = splitTerm[1]
          } else {
            queryName = defaultQueryName
            queryValue = term
          }
          q = q.concat(`${queryName}=${queryValue}&`)
        }
      }
      return q.slice(0, -1) // Remove trailing '&'
    } else {
      // If passed a single query param as a string
      return `${defaultQueryName}=${input}`
    }
  }

  // Search query string to be passed to the UKRDC API search
  const apiQueryString = computed(() => {
    return buildAPIQueryStringFromArray(searchTermArray.value)
  })

  watch([route], () => {
    searchApply()
  })

  onMounted(() => {
    searchApply()
  })

  return {
    searchQueryIsPopulated,
    searchTermArray,
    searchboxString,
    searchSubmit,
    apiQueryString,
  }
}
