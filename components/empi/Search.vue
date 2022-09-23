<!--
Mini (half-width) search bar and results pages used in the EMPI Merge page.
-->

<template>
  <div>
    <div class="mb-4">
      <SearchBar v-model="searchboxString" :focus="true" :show-button="false" @submit="searchSubmit" />
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
            <MasterrecordsListItem class="cursor-pointer" :item="item" @click.native="$emit('select', item.id)" />
          </div>
        </ul>
        <GenericPaginator
          class="border-t border-gray-200 bg-white"
          :page="page"
          :size="size"
          :total="total"
          :show-pages="false"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";

import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import usePagination from "~/composables/query/usePagination";

import useRecordSearch from "~/composables/query/useRecordSearch";
import useApi from "~/composables/useApi";

export default defineComponent({
  props: {
    numberTypes: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  setup(props) {
    const { page, total, size } = usePagination();
    const { searchQueryIsPopulated, searchboxString, searchSubmit, searchTermArray } = useRecordSearch();
    const { searchApi } = useApi();

    // Data refs

    const masterrecords = ref([] as MasterRecordSchema[]);

    // Data fetching
    const searchInProgress = ref(false);

    function fetchResults() {
      if (searchQueryIsPopulated.value) {
        searchInProgress.value = true;

        searchApi
          .getSearchMasterrecords({
            search: searchTermArray.value.filter((n) => n) as string[],
            page: page.value || 1,
            size: size.value,
            numberType: props.numberTypes.filter((n) => n) as string[],
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
      fetchResults();
    });

    watch([searchTermArray, page], () => {
      fetchResults();
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
    };
  },
  head: {
    title: "Master Records",
  },
});
</script>
