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
    showUKRDC: boolean = false,
    onlyUKRDC: boolean = false
  ): Promise<MasterRecordPage> {
    let path = `/v1/search/?${queryString}&page=${page}&size=${size}`;
    if (showUKRDC) {
      path = path + "&include_ukrdc=true";
    }
    if (onlyUKRDC) {
      path = path + `&number_type=UKRDC`;
    }

    // Fetch the search results from our API server
    searchInProgress.value = true;
    const results: MasterRecordPage = await $api.$get(path);
    searchInProgress.value = false;
    return results;
  }

  return { fetchSearchResultsPage, searchInProgress };
}
