<template>
  <div>
    <BaseCard class="mb-4 !overflow-visible px-4 pt-4">
      <SearchBar v-model="searchboxString" :focus="true" @submit="searchSubmit" />
      <BaseCollapseHeader v-model="advancedOpen" class="mb-4" label="More Options"></BaseCollapseHeader>
      <!-- More Options -->
      <div v-show="advancedOpen">
        <!-- Facility filter -->
        <BaseSelectSearchable
          v-if="facilityIds.length > 1"
          v-model="selectedFacility"
          class="mb-4"
          :options="facilityIds"
          :labels="facilityLabels"
          hint="Select a facility..."
        />
        <!-- MasterRecord type filter (will be redundant with new EMPI)-->
        <div class="mb-4 flex flex-grow items-center gap-2">
          <BaseCheckpill v-model="numberTypes" label="UKRDC" value="UKRDC" colour="red" />
          <BaseCheckpill v-model="numberTypes" label="NHS" value="NHS" colour="blue" />
          <BaseCheckpill v-model="numberTypes" label="CHI" value="CHI" colour="purple" />
          <BaseCheckpill v-model="numberTypes" label="HSC" value="HSC" colour="green" />
        </div>
      </div>
    </BaseCard>

    <!-- If loading -->
    <div v-if="searchInProgress">
      <BaseCard>
        <!-- Skeleton results -->
        <ul class="divide-y divide-gray-300">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
      </BaseCard>
    </div>
    <!-- If not loading, and results are not empty -->
    <div v-else-if="masterrecords.length > 0">
      <BaseCard>
        <!-- Real results -->
        <ul class="divide-y divide-gray-300">
          <div v-for="item in masterrecords" :key="item.id" class="hover:bg-gray-50">
            <NuxtLink :to="`/masterrecords/${item.id}`">
              <MasterRecordsListItem :item="item" />
            </NuxtLink>
          </div>
        </ul>
        <BasePaginator
          class="border-t border-gray-200 bg-white"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </BaseCard>
    </div>
    <!-- If not loading, and results are empty -->
    <div v-else class="mt-2 text-center text-gray-500">
      <!-- If not loading, and results are empty, and a search term has been entered -->
      <div v-if="anySearchTermsEntered">No results found</div>
      <!-- If not loading, and results are empty, and no search terms have been entered -->
      <div v-else>
        <p class="mb-4">Search by name, date of birth, national ID, or local ID</p>
        <p><b>Tip: </b>Refine your search by joining terms,</p>
        <p class="mb-4">
          For example,
          <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-gray-800">
            john && 1/12/1980
          </span>
        </p>
        <p>Search for an exact name using quote marks,</p>
        <p>
          For example,
          <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-gray-800"> "jon" </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCheckpill from "~/components/base/BaseCheckpill.vue";
import BaseCollapseHeader from "~/components/base/BaseCollapseHeader.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelectSearchable from "~/components/base/BaseSelectSearchable.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import MasterRecordsListItem from "~/components/MasterRecordsListItem.vue";
import SearchBar from "~/components/SearchBar.vue";
import usePagination from "~/composables/query/usePagination";
import useQuery from "~/composables/query/useQuery";
import useRecordSearch from "~/composables/query/useRecordSearch";
import useApi from "~/composables/useApi";
import useFacilities from "~/composables/useFacilities";

export default defineComponent({
  components: {
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
    BaseCheckpill,
    BaseSelectSearchable,
    BaseCollapseHeader,
    MasterRecordsListItem,
    SearchBar,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { arrayQuery } = useQuery();
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities();
    const { searchQueryIsPopulated, searchboxString, searchSubmit, searchTermArray } = useRecordSearch();
    const { searchApi, systemInfoApi } = useApi();

    // Data refs

    const masterrecords = ref([] as MasterRecordSchema[]);
    const numberTypes = arrayQuery("numberType", [], true, true);

    const advancedOpen = ref(false);

    const anySearchTermsEntered = computed(() => {
      return searchQueryIsPopulated.value || selectedFacility.value;
    });

    // Handle number type filtering
    function initNumberTypes() {
      if (numberTypes.value.length === 0) {
        systemInfoApi.getSystemUserPreferences().then((response) => {
          const showUkrdcByDefault = response.data.searchShowUkrdc;
          if (showUkrdcByDefault) {
            numberTypes.value = ["UKRDC", "NHS", "CHI", "HSC", "UKRR_UID"];
          } else {
            numberTypes.value = ["NHS", "CHI", "HSC", "UKRR_UID"];
          }
        });
      }
    }

    // Data fetching
    const searchInProgress = ref(false);

    function getResults() {
      // If search terms or advanced filters have been set, do the search
      if (anySearchTermsEntered.value) {
        searchInProgress.value = true;

        searchApi
          .getSearchMasterrecords({
            search: searchTermArray.value.filter((n) => n) as string[],
            page: page.value || 1,
            size: size.value,
            numberType: numberTypes.value.filter((n) => n) as string[],
            facility: selectedFacility.value ? [selectedFacility.value] : undefined,
          })
          .then((response) => {
            masterrecords.value = response.data.items;
            page.value = response.data.page ?? 0;
            total.value = response.data.total;
            size.value = response.data.size ?? 0;

            searchInProgress.value = false;
          });
      }
    }

    onMounted(() => {
      // Open advanced options if any are already set by the URL
      advancedOpen.value = !!selectedFacility.value;

      // If no explicit search query is active, use default number type filters
      initNumberTypes();

      // Fetch results
      getResults();
    });

    watch([searchTermArray, selectedFacility, page, numberTypes], () => {
      initNumberTypes();
      getResults();
    });

    return {
      masterrecords,
      searchboxString,
      searchInProgress,
      searchSubmit,
      anySearchTermsEntered,
      page,
      size,
      total,
      numberTypes,
      advancedOpen,
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
    };
  },
  head: {
    title: "Master Records",
  },
});
</script>
