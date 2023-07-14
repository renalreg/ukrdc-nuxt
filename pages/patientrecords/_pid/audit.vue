<template>
  <div>
    <div class="mb-4 flex flex-col">
      <div class="flex flex-row gap-2">
        <BaseDateRange v-model="dateRange" class="flex-1" />
        <BaseButtonMini class="flex-none" @click="toggleOrder">
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
      <ul v-if="!events" class="divide-y divide-gray-300">
        <BaseSkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-300">
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
import { AuditEventSchema, OrderBy, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import AuditListItem from "~/components/AuditListItem.vue";
import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseDateRange from "~/components/base/BaseDateRange.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import IconBarsArrowDown from "~/components/icons/hero/20/solid/IconBarsArrowDown.vue";
import IconBarsArrowUp from "~/components/icons/hero/20/solid/IconBarsArrowUp.vue";
import useDateRange from "~/composables/query/useDateRange";
import usePagination from "~/composables/query/usePagination";
import useSortBy from "~/composables/query/useSortBy";
import useApi from "~/composables/useApi";
import { nowString } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
    BaseDateRange,
    IconBarsArrowDown,
    IconBarsArrowUp,
    AuditListItem,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup(props) {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { patientRecordsApi } = useApi();

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-30), nowString(0), true);

    // Data refs
    const events = ref<AuditEventSchema[]>();

    // Data fetching

    function fetchEvents() {
      patientRecordsApi
        .getPatientAudit({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
          orderBy: orderBy.value as OrderBy,
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
        })
        .then((response) => {
          events.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
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
