<template>
  <div>
    <div class="mx-auto mb-4 flex">
      <div class="flex-grow">
        <TextH1>Codes List</TextH1>
      </div>
      <div>
        <div v-click-away="closeExportMenu" class="relative flex">
          <BaseButton @click="showExportMenu = !showExportMenu">
            <div class="flex items-center">
              <div class="flex-grow">Export Codes</div>
              <div class="ml-2">
                <IconChevronDown class="text-gray-700" />
              </div>
            </div>
          </BaseButton>
          <GenericMenu class="-right-2 z-10 mb-2 mt-14" :show="showExportMenu">
            <GenericMenuItem @click="exportCodeList"> Export Code List </GenericMenuItem>
            <GenericMenuItem @click="exportCodeMaps"> Export Code Maps </GenericMenuItem>
            <GenericMenuItem @click="exportCodeExclusions"> Export Code Exclusions </GenericMenuItem>
          </GenericMenu>
        </div>
      </div>
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
        <BaseCard>
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
        </BaseCard>
      </div>
      <!-- Code details -->
      <div>
        <BaseButton
          v-show="$route.params.id"
          class="mb-4 w-full lg:hidden"
          :to="{ path: `/codes/`, query: $route.query }"
          >Back to List</BaseButton
        >
        <BaseCard class="pt-4" :class="$route.params.id ? 'block' : 'hidden lg:block'">
          <NuxtChild />
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { CodeSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";

import useQuery from "~/composables/query/useQuery";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { saveAs } from "~/helpers/fileUtils";

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
  },
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

    // Code exporting

    const showExportMenu = ref(false);

    function closeExportMenu() {
      showExportMenu.value = false;
    }

    function exportCodeList() {
      codesApi
        .getCodeListExport()
        .then(({ data }) => {
          const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          saveAs(blob, "code-list.csv");
        })
        .finally(() => {
          closeExportMenu();
        });
    }

    function exportCodeMaps() {
      codesApi
        .getCodeMapsExport()
        .then(({ data }) => {
          const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          saveAs(blob, "code-maps.csv");
        })
        .finally(() => {
          closeExportMenu();
        });
    }

    function exportCodeExclusions() {
      codesApi
        .getCodeExclusionsExport()
        .then(({ data }) => {
          const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          saveAs(blob, "code-exclusions.csv");
        })
        .finally(() => {
          closeExportMenu();
        });
    }

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
      showExportMenu,
      closeExportMenu,
      exportCodeList,
      exportCodeMaps,
      exportCodeExclusions,
    };
  },
  head: {
    title: "Code List",
  },
});
</script>
