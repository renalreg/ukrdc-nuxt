import { MasterRecord } from "~/interfaces/masterrecord";

interface MasterRecordPage {
  items: MasterRecord[];
  total: number;
  page: number;
  size: number;
}

export default function () {
  const { $api } = useNuxtApp();

  const searchInProgress = ref(false);

  async function fetchSearchResultsPage(
    queryString: string,
    page: number,
    size: number,
    numberTypes: (string | null)[] = []
  ): Promise<MasterRecordPage> {
    let path = `/v1/search/?${queryString}&page=${page}&size=${size}`;
    // Pass selected statuses to the API
    for (const numberType of numberTypes) {
      path = path + `&number_type=${numberType}`;
    }

    // Fetch the search results from our API server
    searchInProgress.value = true;
    const results: MasterRecordPage = await $api.$get(path);
    searchInProgress.value = false;
    return results;
  }

  return { fetchSearchResultsPage, searchInProgress };
}
