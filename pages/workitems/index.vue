<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Work Items</h1>
    </div>

    <div class="mb-4 flex flex-col">
      <BaseDateRange v-model="dateRange" class="mb-4" />
      <BaseSelectSearchable
        v-if="facilityIds.length > 1"
        v-model="selectedFacility"
        class="mb-4"
        :options="facilityIds"
        :labels="facilityLabels"
        hint="Select a facility..."
      />
      <div class="flex items-center">
        <div class="flex-grow"><BaseTabsModel v-model="currentTab" :tabs="workItemStatusTabs" :mini="true" /></div>
        <BaseButtonMini class="flex-shrink" @click="toggleOrder">
          <div v-show="orderAscending" class="flex">
            <p>Oldest - Newest</p>
            <IconBarsArrowUp class="ml-2 h-5 w-5" />
          </div>
          <div v-show="!orderAscending" class="flex">
            <p>Newest - Oldest</p>
            <IconBarsArrowDown class="ml-2 h-5 w-5" />
          </div>
        </BaseButtonMini>
      </div>
    </div>

    <BaseCard>
      <!-- Skeleton results -->
      <div v-if="fetchInProgress">
        <ul class="divide-y divide-gray-300">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
      </div>
      <!-- Real results -->
      <div v-else>
        <ul class="divide-y divide-gray-300">
          <div v-for="item in workitems" :key="item.id" :item="item" class="hover:bg-gray-50">
            <NuxtLink :to="`/workitems/${item.id}`">
              <WorkItemsListItem :item="item" />
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
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { OrderBy, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseDateRange from "~/components/base/BaseDateRange.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelectSearchable from "~/components/base/BaseSelectSearchable.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BaseTabsModel from "~/components/base/BaseTabsModel.vue";
import IconBarsArrowDown from "~/components/icons/hero/20/solid/IconBarsArrowDown.vue";
import IconBarsArrowUp from "~/components/icons/hero/20/solid/IconBarsArrowUp.vue";
import WorkItemsListItem from "~/components/workitem/WorkItemsListItem.vue";
import useDateRange from "~/composables/query/useDateRange";
import usePagination from "~/composables/query/usePagination";
import useQuery from "~/composables/query/useQuery";
import useSortBy from "~/composables/query/useSortBy";
import useApi from "~/composables/useApi";
import useFacilities from "~/composables/useFacilities";
import { workItemStatusTabs } from "~/helpers/workItemUtils";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
    BaseDateRange,
    BaseSelectSearchable,
    BaseTabsModel,
    IconBarsArrowDown,
    IconBarsArrowUp,
    WorkItemsListItem,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { arrayQuery } = useQuery();
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { workItemsApi } = useApi();

    // Data refs
    const workitems = ref<WorkItemSchema[]>();
    const statuses = arrayQuery("status", ["1"], true, true);

    const fetchInProgress = ref(false);

    // Set initial date dateRange
    const dateRange = makeDateRange(null, null, true, true);

    // Work tiem status tab
    const currentTab = ref<number>(1);

    // Data fetching

    function getWorkitems() {
      fetchInProgress.value = true;

      workItemsApi
        .getWorkitems({
          page: page.value || 1,
          size: size.value,
          orderBy: orderBy.value as OrderBy,
          status: [currentTab.value],
          facility: selectedFacility.value || undefined,
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
        })
        .then((response) => {
          workitems.value = response.data.items;
          page.value = response.data.page ?? 0;
          total.value = response.data.total;
          size.value = response.data.size ?? 0;
        })
        .finally(() => {
          fetchInProgress.value = false;
        });
    }

    onMounted(() => {
      getWorkitems();
    });

    watch(
      [
        page,
        selectedFacility,
        orderBy,
        currentTab,
        () => JSON.stringify(dateRange.value), // Stringify to watch for actual value changes
        () => JSON.stringify(statuses.value), // Stringify to watch for actual value changes
      ],
      () => {
        getWorkitems();
      }
    );

    return {
      fetchInProgress,
      page,
      total,
      size,
      dateRange,
      workitems,
      statuses,
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
      orderAscending,
      orderBy,
      toggleOrder,
      workItemStatusTabs,
      currentTab,
    };
  },
  head: {
    title: "Work Items",
  },
});
</script>

<style></style>
