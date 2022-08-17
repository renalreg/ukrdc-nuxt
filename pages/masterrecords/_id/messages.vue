<template>
  <div>
    <div class="mb-4 flex flex-col gap-2 lg:flex-row">
      <GenericDateRange v-model="dateRange" class="flex-1" />
      <GenericButtonMini class="flex-none" @click="toggleOrder">
        <div v-show="orderAscending" class="flex">
          <TextP>Oldest - Newest</TextP><IconMiniSortAscending class="ml-2" />
        </div>
        <div v-show="!orderAscending" class="flex">
          <TextP>Newest - Oldest</TextP><IconMiniSortDescending class="ml-2" />
        </div>
      </GenericButtonMini>
    </div>

    <GenericCard>
      <!-- Skeleton results -->
      <ul v-if="!messages" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in messages" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :show-patient-filter="false" :item="item" />
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";

import { MasterRecordSchema, MasterRecordStatisticsSchema, MessageSchema, OrderBy } from "@ukkidney/ukrdc-axios-ts";
import { nowString } from "@/helpers/utils/dateUtils";
import usePagination from "~/helpers/query/usePagination";
import useSortBy from "~/helpers/query/useSortBy";
import useDateRange from "~/helpers/query/useDateRange";

import useApi from "~/helpers/useApi";

export default defineComponent({
  props: {
    record: {
      type: Object as () => MasterRecordSchema,
      required: true,
    },
    stats: {
      type: Object as () => MasterRecordStatisticsSchema,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { masterRecordsApi } = useApi();

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-365), nowString(0), true);

    // Data refs
    const messages = ref<MessageSchema[]>();

    // Data fetching

    function fetchMessages() {
      masterRecordsApi
        .getMasterRecordMessages({
          recordId: props.record.id,
          page: page.value || 1,
          size: size.value,
          orderBy: orderBy.value as OrderBy,
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
        })
        .then((response) => {
          messages.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;
        });
    }

    onMounted(() => {
      fetchMessages();
    });

    watch(
      [
        page,
        orderBy,
        () => JSON.stringify(dateRange), // Stringify to watch for actual value changes
      ],
      () => {
        fetchMessages();
      }
    );

    return {
      page,
      total,
      size,
      dateRange,
      messages,
      orderAscending,
      orderBy,
      toggleOrder,
    };
  },
});
</script>
