<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <TextH1>Codes List</TextH1>
    </div>

    <div v-if="standards && standards.length > 1" :class="$route.params.id ? 'hidden lg:block' : 'block'">
      <GenericSearchableSelect
        v-model="selectedStandard"
        class="mb-4"
        :options="standards"
        hint="Select a coding standard..."
        :mount-opened="false"
        :closable="true"
      />
    </div>

    <div>
      <SearchBar v-model="searchboxString" :focus="false" :show-button="false" />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Code list -->
      <div :class="$route.params.id ? 'hidden lg:block' : 'block'">
        <GenericCard>
          <!-- Skeleton results -->
          <ul v-if="fetchInProgress" class="divide-y divide-gray-200">
            <SkeleListItem v-for="n in 10" :key="n" />
          </ul>
          <!-- Real results -->
          <ul v-else class="divide-y divide-gray-200">
            <div v-for="code in codes" :key="`${code.codingStandard}.${code.code}`">
              <NuxtLink :to="{ path: `/codes/${code.codingStandard}.${code.code}/`, query: $route.query }">
                <CodesListItem class="hover:bg-gray-50" :code="code" />
              </NuxtLink>
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
      <!-- Code details -->
      <div>
        <GenericButton
          v-show="$route.params.id"
          class="mb-4 w-full lg:hidden"
          :to="{ path: `/codes/`, query: $route.query }"
          >Back to List</GenericButton
        >
        <GenericCard class="pt-4" :class="$route.params.id ? 'block' : 'hidden lg:block'">
          <NuxtChild />
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CodeSchema } from "@ukkidney/ukrdc-axios-ts";
import useQuery from "~/helpers/query/useQuery";
import usePagination from "~/helpers/query/usePagination";
import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination();
    const { stringQuery } = useQuery();
    const { codesApi } = useApi();

    // Data refs

    const standards = ref<string[]>();
    const selectedStandard = stringQuery("standard", null, true, true);

    const codes = ref([] as CodeSchema[]);
    const selectedCode = ref<CodeSchema>();

    const searchboxString = stringQuery("search", null, true, true);

    const fetchInProgress = ref(false);

    // Data fetching
    function getCodes() {
      fetchInProgress.value = true;

      codesApi
        .getCodeList({
          page: page.value || 1,
          size: size.value,
          codingStandard: selectedStandard.value ? [selectedStandard.value] : undefined,
          search: searchboxString.value || undefined,
        })
        .then((response) => {
          codes.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;
          fetchInProgress.value = false;
        });
    }

    onMounted(() => {
      codesApi.getCodingStandardsList().then((response) => {
        standards.value = response.data;
      });
      getCodes();
    });

    watch([page, selectedStandard, searchboxString], () => {
      getCodes();
    });

    return {
      standards,
      selectedStandard,
      codes,
      selectedCode,
      searchboxString,
      getCodes,
      fetchInProgress,
      page,
      total,
      size,
    };
  },
  head: {
    title: "Code List",
  },
});
</script>
