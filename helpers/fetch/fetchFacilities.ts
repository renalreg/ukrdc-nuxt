import { useContext } from "@nuxtjs/composition-api";
import { buildCommonMessageQuery, MessagePage } from "./common";
import { Facility } from "~/interfaces/facilities";
import { HistoryItem } from "~/interfaces/common";

export default function () {
  const { $api } = useContext();

  async function fetchFacilitiesList(
    sortBy: string | null = null,
    orderBy: string | null = null,
    includeEmpty: boolean = true
  ): Promise<Facility[]> {
    let path = `/v1/facilities/?include_empty=${includeEmpty}`;
    if (sortBy) {
      path = path + `&sort_by=${sortBy}`;
    }
    if (orderBy) {
      path = path + `&order_by=${orderBy}`;
    }
    return (await $api.$get(path)) as Facility[];
  }

  async function fetchFacility(code: string): Promise<Facility> {
    return (await $api.$get(`/v1/facilities/${code}`)) as Facility;
  }

  async function fetchFacilityErrorsHistory(facility: Facility): Promise<HistoryItem[]> {
    return (await $api.$get(facility.links.errorsHistory)) as HistoryItem[];
  }

  async function fetchFacilityPatientsLatestErrorsPage(
    facility: Facility,
    page: number,
    size: number,
    orderBy: string | null
  ): Promise<MessagePage> {
    let path = `${facility.links.patientsLatestErrors}?page=${page}&size=${size}&sort_by=received`;
    // Filter by status and date
    path = path + buildCommonMessageQuery(orderBy, null, null, null);
    return (await $api.$get(path)) as MessagePage;
  }

  return { fetchFacilitiesList, fetchFacility, fetchFacilityErrorsHistory, fetchFacilityPatientsLatestErrorsPage };
}
