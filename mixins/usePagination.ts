import { ref } from '@nuxtjs/composition-api'
import useQuery from '@/mixins/useQuery'

export default function () {
  const { integerQuery } = useQuery()

  const page = integerQuery('page', 0)
  const total = ref(0)
  const size = ref(20)

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
