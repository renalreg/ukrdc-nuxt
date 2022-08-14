<template>
  <div>
    <div class="mb-4">
      <SearchBar v-model="searchboxString" :focus="true" @submit="searchSubmit" />
      <div class="flex flex-grow items-center gap-2">
        <FormCheckboxPill v-model="numberTypes" label="UKRDC" value="UKRDC" colour="red" />
        <FormCheckboxPill v-model="numberTypes" label="NHS" value="NHS" colour="blue" />
        <FormCheckboxPill v-model="numberTypes" label="CHI" value="CHI" colour="purple" />
        <FormCheckboxPill v-model="numberTypes" label="HSC" value="HSC" colour="green" />
      </div>
    </div>

    <div v-if="masterrecords.length > 0">
      <GenericCard>
        <!-- Skeleton results -->
        <ul v-if="searchInProgress" class="divide-y divide-gray-200">
          <SkeleListItem v-for="n in 10" :key="n" />
        </ul>
        <!-- Real results -->
        <ul v-else class="divide-y divide-gray-200">
          <div v-for="item in masterrecords" :key="item.id" class="hover:bg-gray-50">
            <NuxtLink :to="`/masterrecords/${item.id}`">
              <MasterrecordsListItem :item="item" />
            </NuxtLink>
          </div>
        </ul>
        <GenericPaginator
          class="border-t border-gray-200 bg-white"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </GenericCard>
    </div>
    <div v-else class="mt-2 text-center text-gray-500">
      <LoadingIndicator v-if="searchQueryIsPopulated && searchInProgress"></LoadingIndicator>
      <div v-else-if="searchQueryIsPopulated && !searchInProgress">No results found</div>
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
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import usePagination from "~/helpers/query/usePagination";
import useQuery from "~/helpers/query/useQuery";
import useRecordSearch from "~/helpers/query/useRecordSearch";
import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination();
    const { arrayQuery } = useQuery();
    const { searchQueryIsPopulated, searchboxString, searchSubmit, searchTermArray } = useRecordSearch();
    const { searchApi, systemInfoApi } = useApi();

    // Data refs

    const masterrecords = ref([] as MasterRecordSchema[]);
    const numberTypes = arrayQuery("numberType", [], true, true);

    // Data fetching
    const searchInProgress = ref(false);

    function getResults() {
      if (searchQueryIsPopulated.value) {
        searchInProgress.value = true;

        searchApi
          .getSearchMasterrecords({
            search: searchTermArray.value.filter((n) => n) as string[],
            page: page.value || 1,
            size: size.value,
            numberType: numberTypes.value.filter((n) => n) as string[],
          })
          .then((response) => {
            masterrecords.value = response.data.items;
            page.value = response.data.page;
            total.value = response.data.total;
            size.value = response.data.size;

            searchInProgress.value = false;
          });
      }
    }

    onMounted(() => {
      if (!searchQueryIsPopulated.value) {
        systemInfoApi.getSystemUserPreferences().then((response) => {
          const showUkrdcByDefault = response.data.searchShowUkrdc;
          if (showUkrdcByDefault) {
            numberTypes.value = ["UKRDC", "NHS", "CHI", "HSC"];
          } else {
            numberTypes.value = ["NHS", "CHI", "HSC"];
          }
        });
      }

      getResults();
    });

    watch([searchTermArray, page, numberTypes], () => {
      getResults();
    });

    return {
      masterrecords,
      searchboxString,
      searchInProgress,
      searchSubmit,
      searchQueryIsPopulated,
      page,
      size,
      total,
      numberTypes,
    };
  },
  head: {
    title: "Master Records",
  },
});
</script>
