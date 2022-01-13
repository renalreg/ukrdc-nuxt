import { useContext } from '@nuxtjs/composition-api'
import { Code, ExtendedCode } from '@/interfaces/codes'

interface CodesPage {
  items: Code[]
  total: number
  page: number
  size: number
}

export default function () {
  const { $api } = useContext()

  async function fetchCodingStandards(): Promise<string[]> {
    const standardsResponse: string[] = await $api.$get('/v1/codes/standards/')
    standardsResponse.sort()
    return standardsResponse
  }

  async function fetchCodesPage(
    page: number,
    size: number,
    standard: string | null,
    search: string | null
  ): Promise<CodesPage> {
    // Fetch code list
    let path = `/v1/codes/list/?page=${page}&size=${size}`
    // Filter by service if it exists
    if (standard) {
      path = path + `&coding_standard=${encodeURIComponent(standard)}`
    }
    // Filter by search term if it exists
    if (search) {
      path = path + `&search=${encodeURIComponent(search)}`
    }
    return (await $api.$get(path)) as CodesPage
  }

  async function fetchCode(code: string): Promise<ExtendedCode> {
    return (await $api.$get(`/v1/codes/list/${code}/`)) as ExtendedCode
  }

  return { fetchCodingStandards, fetchCodesPage, fetchCode }
}
