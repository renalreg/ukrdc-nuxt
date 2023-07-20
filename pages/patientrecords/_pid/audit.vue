<template>
  <div>
    <div class="mb-4 flex flex-col">
      <div class="mb-4 flex flex-row gap-2">
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
      <div class="flex gap-4">
        <BaseSelect v-model="selectedResource">
          <option value="" disabled selected hidden>Select a resource type</option>
          <option :value="null">All resources</option>
          <option v-for="resource in availableResources" :key="resource">{{ resource }}</option>
        </BaseSelect>
        <BaseSelect v-model="selectedOperation">
          <option value="" disabled selected hidden>Select an operation</option>
          <option :value="null">All operations</option>
          <option v-for="operation in availableOperations" :key="operation">{{ operation }}</option>
        </BaseSelect>
      </div>
    </div>

    <BaseCard>
      <!-- Skeleton results -->
      <div v-if="auditFetchInProgress">
        <ul v-if="auditFetchInProgress" class="divide-y divide-gray-300">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
      </div>
      <!-- Real results -->
      <div v-else>
        <ul class="divide-y divide-gray-300">
          <li v-for="item in events" :key="item.id">
            <AuditListItem :item="item" />
          </li>
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
import { AuditEventSchema, AuditOperation, OrderBy, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import { Resource } from "@ukkidney/ukrdc-axios-ts/api";

import AuditListItem from "~/components/AuditListItem.vue";
import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseDateRange from "~/components/base/BaseDateRange.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelect from "~/components/base/BaseSelect.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import IconBarsArrowDown from "~/components/icons/hero/20/solid/IconBarsArrowDown.vue";
import IconBarsArrowUp from "~/components/icons/hero/20/solid/IconBarsArrowUp.vue";
import useDateRange from "~/composables/query/useDateRange";
import usePagination from "~/composables/query/usePagination";
import useQuery from "~/composables/query/useQuery";
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
    BaseSelect,
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
    const { stringQuery } = useQuery();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { patientRecordsApi } = useApi();

    // Set initial date dateRange
    const dateRange = makeDateRange(nowString(-30), nowString(0), true);

    // Data refs
    const events = ref<AuditEventSchema[]>();

    const availableResources: string[] = Object.values(Resource).sort();
    const selectedResource = stringQuery("resource", null, true, true);
    const availableOperations: string[] = Object.values(AuditOperation).sort();
    const selectedOperation = stringQuery("operation", null, true, true);

    // Filtering

    function setResource(value: string | null) {
      selectedResource.value = value
    }

    // Data fetching

    const auditFetchInProgress = ref(false);

    function fetchEvents() {
      auditFetchInProgress.value = true;

      patientRecordsApi
        .getPatientAudit({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
          orderBy: orderBy.value as OrderBy,
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
          ...(selectedResource.value) && {resource: selectedResource.value as Resource},
          ...(selectedOperation.value) && {operation: selectedOperation.value as AuditOperation},
        })
        .then((response) => {
          events.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
        })
        .finally(() => {
          auditFetchInProgress.value = false;
        });
    }

    onMounted(() => {
      fetchEvents();
    });

    watch(
      [
        page,
        orderBy,
        selectedResource,
        selectedOperation,
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
      availableResources,
      selectedResource,
      availableOperations,
      selectedOperation,
      auditFetchInProgress,
      setResource
    };
  },
});
</script>
