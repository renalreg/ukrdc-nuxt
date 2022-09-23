<template>
  <div>
    <div class="mb-4 flex flex-col">
      <div class="flex flex-row gap-2">
        <GenericDateRange v-model="dateRange" class="flex-1" />
        <BaseButtonMini class="flex-none" @click="toggleOrder">
          <div v-show="orderAscending" class="flex">
            <p>Oldest - Newest</p>
            <IconMiniSortAscending class="ml-2" />
          </div>
          <div v-show="!orderAscending" class="flex">
            <p>Newest - Oldest</p>
            <IconMiniSortDescending class="ml-2" />
          </div>
        </BaseButtonMini>
      </div>
    </div>

    <BaseCard>
      <!-- Skeleton results -->
      <ul v-if="!events" class="divide-y divide-gray-200">
        <BaseSkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in events" :key="item.id" :item="item">
          <AuditListItem :item="item" />
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { AuditEventSchema, MasterRecordSchema, OrderBy } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";

import { nowString } from "~/helpers/dateUtils";
import usePagination from "~/composables/query/usePagination";
import useSortBy from "~/composables/query/useSortBy";
import useDateRange from "~/composables/query/useDateRange";

import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
  },
  props: {
    record: {
      type: Object as () => MasterRecordSchema,
      required: true,
    },
  },
  setup(props) {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { masterRecordsApi } = useApi();

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-30), nowString(0), true);

    // Data refs
    const events = ref<AuditEventSchema[]>();

    // Data fetching

    function fetchEvents() {
      masterRecordsApi
        .getMasterRecordAudit({
          recordId: props.record.id,
          page: page.value || 1,
          size: size.value,
          orderBy: orderBy.value as OrderBy,
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
        })
        .then((response) => {
          events.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;
        });
    }

    onMounted(() => {
      fetchEvents();
    });

    watch(
      [
        page,
        orderBy,
        () => JSON.stringify(dateRange.value), // Stringify to watch for actual value changes
      ],
      () => {
        fetchEvents();
      }
    );

    return {
      page,
      total,
      size,
      dateRange,
      events,
      orderAscending,
      orderBy,
      toggleOrder,
    };
  },
});
</script>
