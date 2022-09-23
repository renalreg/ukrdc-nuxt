<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Data Files</h1>
    </div>

    <div class="mb-4 flex flex-col">
      <GenericDateRange v-model="dateRange" class="mb-4" />
      <GenericSearchableSelect
        v-if="facilityIds.length > 1"
        v-model="selectedFacility"
        class="mb-4"
        :options="facilityIds"
        :labels="facilityLabels"
        hint="Select a facility..."
      />
      <div class="flex flex-col gap-2 lg:flex-row">
        <div class="flex flex-grow items-center gap-4">
          <FormCheckbox v-model="statuses" label="Stored" value="STORED" />
          <FormCheckbox v-model="statuses" label="Received" value="RECEIVED" />
          <FormCheckbox v-model="statuses" label="Error" value="ERROR" />
          <FormCheckbox v-model="statuses" label="Resolved" value="RESOLVED" />
        </div>

        <form v-show="!nationalId" class="flex" @submit.prevent="nationalId = nationalIdSearchString.trim()">
          <FormTextBoxMini
            v-model="nationalIdSearchString"
            class="z-20 flex-grow rounded-r-none"
            placeholder="Filter by Patient Number"
          ></FormTextBoxMini>
          <BaseButtonMini class="z-10" anchor="left" type="submit">Go</BaseButtonMini>
        </form>

        <BaseButtonMini v-show="nationalId" @click="$router.push({ query: { nationalid: null } })"
          >Show Results From All Patients</BaseButtonMini
        >

        <BaseButtonMini @click="toggleOrder">
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
      <ul v-if="fetchInProgress" class="divide-y divide-gray-200">
        <BaseSkeleListItem v-for="n in 10" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else class="divide-y divide-gray-200">
        <div v-for="item in messages" :key="item.id" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
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
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { MessageSchema, OrderBy } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseButtonMini from "@/components/base/BaseButtonMini.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";

import { nowString } from "~/helpers/dateUtils";
import usePagination from "~/composables/query/usePagination";
import useDateRange from "~/composables/query/useDateRange";

import usePermissions from "~/composables/usePermissions";
import useFacilities from "~/composables/useFacilities";
import useQuery from "~/composables/query/useQuery";
import useSortBy from "~/composables/query/useSortBy";

import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseCard,
    BaseSkeleListItem,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { stringQuery, arrayQuery } = useQuery();
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { messagesApi } = useApi();
    const { isAdmin } = usePermissions();

    // Set up URL query params for additional filters
    const nationalId = stringQuery("nationalid", null, true, true);
    const nationalIdSearchString = ref<string>("");

    // Set initial date dateRange
    const dateRange = makeDateRange(isAdmin ? nowString(-30) : nowString(-365), nowString(0), true);

    // Data refs
    const messages = ref<MessageSchema[]>();
    const statuses = arrayQuery("status", ["ERROR"], true, true);

    const fetchInProgress = ref(false);

    // Data fetching
    function getMessages() {
      fetchInProgress.value = true;

      messagesApi
        .getMessages({
          page: page.value || 1,
          size: size.value,
          orderBy: orderBy.value as OrderBy,
          status: statuses.value.filter((n) => n) as string[],
          since: dateRange.value.start || undefined,
          until: dateRange.value.end || undefined,
          facility: selectedFacility.value || undefined,
          ni: [nationalId.value].filter((n) => n) as string[],
        })
        .then((response) => {
          messages.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;
        })
        .finally(() => {
          fetchInProgress.value = false;
        });
    }

    onMounted(() => {
      getMessages();
    });

    watch(
      [
        page,
        orderBy,
        selectedFacility,
        nationalId,
        () => JSON.stringify(dateRange.value), // Stringify to watch for actual value changes
        () => JSON.stringify(statuses.value), // Stringify to watch for actual value changes
      ],
      () => {
        getMessages();
      }
    );

    return {
      fetchInProgress,
      page,
      total,
      size,
      dateRange,
      messages,
      statuses,
      facilities,
      facilityIds,
      facilityLabels,
      selectedFacility,
      nationalId,
      nationalIdSearchString,
      orderAscending,
      orderBy,
      toggleOrder,
    };
  },

  head: {
    title: "Data Files",
  },
});
</script>
