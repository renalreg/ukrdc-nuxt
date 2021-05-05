import {
  ref,
  useRoute,
  useRouter,
  watch,
  onMounted,
  computed,
} from '@nuxtjs/composition-api'
import { integerQuery } from '@/utilities/queryUtils'

export default function () {
  const route = useRoute()
  const router = useRouter()

  const page = ref((integerQuery(route.value.query.page) || 0) as number)
  const total = ref(0)
  const size = ref(20)

  const pageQuery = computed(() => integerQuery(route.value.query.page) || 0)

  watch(page, () => {
    updateQueryFromPage()
  })

  watch(pageQuery, () => {
    updatePageFromQuery()
  })

  onMounted(() => {
    updateQueryFromPage()
  })

  function updateQueryFromPage() {
    const newQuery = Object.assign({}, route.value.query, {
      page: page.value.toString(),
    })
    router.push({
      path: route.value.path,
      query: newQuery,
    })
  }

  function updatePageFromQuery() {
    page.value = pageQuery.value as number
  }

  function changePage(newPage: number): void {
    console.warn('changePage is deprecated. Directly set page value instead')
    page.value = newPage
  }
  return {
    page,
    total,
    size,
    changePage,
  }
}
