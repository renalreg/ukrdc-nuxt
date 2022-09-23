import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema } from "@ukkidney/ukrdc-axios-ts";
import useQuery from "~/composables/query/useQuery";
import useApi from "~/composables/useApi";

export default function () {
  const { stringQuery } = useQuery();
  const { facilitiesApi } = useApi();

  const facilities = ref([] as FacilityDetailsSchema[]);
  const facilityIds = computed(() => {
    return facilities.value.map(({ id }) => id);
  });
  const facilityLabels = computed(() => {
    return facilities.value.map(({ description }) => description);
  });
  const selectedFacility = stringQuery("facility", null, true);

  function setFacilities() {
    // If we don't already have a list of available facilties, fetch one
    if (facilities.value.length === 0) {
      facilitiesApi.getFacilityList().then((response) => {
        facilities.value = response.data;
      });
    }
  }

  onMounted(() => {
    setFacilities();
  });

  return {
    facilities,
    facilityIds,
    facilityLabels,
    selectedFacility,
  };
}
