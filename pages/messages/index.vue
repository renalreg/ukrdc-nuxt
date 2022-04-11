<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1 class="text-2xl font-semibold text-gray-900">Data Files</h1>
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
      <div class="flex items-center gap-2">
        <div class="flex flex-grow items-center gap-4">
          <FormCheckbox v-model="statuses" label="Stored" value="STORED" />
          <FormCheckbox v-model="statuses" label="Received" value="RECEIVED" />
          <FormCheckbox v-model="statuses" label="Error" value="ERROR" />
          <FormCheckbox v-model="statuses" label="Resolved" value="RESOLVED" />
        </div>

        <form v-show="!nationalId" class="flex" @submit.prevent="nationalId = nationalIdSearchString.trim()">
          <FormTextBoxMini
            v-model="nationalIdSearchString"
            class="z-20 rounded-r-none"
            placeholder="Filter by Patient Number"
          ></FormTextBoxMini>
          <GenericButtonMini class="z-10" anchor="left" type="submit">Go</GenericButtonMini>
        </form>

        <GenericButtonMini v-show="nationalId" @click="$router.push({ query: { nationalid: null } })"
          >Show Results From All Patients</GenericButtonMini
        >

        <GenericButtonMini @click="toggleOrder">
          <div v-show="orderAscending" class="flex">
            <TextP>Oldest - Newest</TextP><IconMiniSortAscending class="ml-2" />
          </div>
          <div v-show="!orderAscending" class="flex">
            <TextP>Newest - Oldest</TextP><IconMiniSortDescending class="ml-2" />
          </div>
        </GenericButtonMini>
      </div>
    </div>

    <GenericCard>
      <!-- Skeleton results -->
      <ul v-if="fetchInProgress" class="divide-y divide-gray-200">
        <SkeleListItem v-for="n in 10" :key="n" />
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
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";

import { nowString } from "@/helpers/utils/dateUtils";
import { Message } from "@/interfaces/messages";
import usePagination from "~/helpers/query/usePagination";
import useDateRange from "~/helpers/query/useDateRange";

import usePermissions from "~/helpers/usePermissions";
import useFacilities from "~/helpers/useFacilities";
import useQuery from "~/helpers/query/useQuery";
import useSortBy from "~/helpers/query/useSortBy";

import fetchMessages from "~/helpers/fetch/fetchMessages";

export default defineComponent({
  setup() {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { stringQuery, arrayQuery } = useQuery();
    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities();
    const { orderAscending, orderBy, toggleOrder } = useSortBy();
    const { fetchMessagesPage } = fetchMessages();
    const { isAdmin } = usePermissions();

    // Set up URL query params for additional filters
    const nationalId = stringQuery("nationalid", null, true, true);
    const nationalIdSearchString = ref<string | null>(null);

    // Set initial date dateRange
    const dateRange = makeDateRange(isAdmin ? nowString(-30) : nowString(-365), nowString(0), true);

    // Data refs
    const messages = ref<Message[]>();
    const statuses = arrayQuery("status", ["ERROR"], true, true);

    const fetchInProgress = ref(false);

    // Data fetching
    async function getMessages() {
      fetchInProgress.value = true;

      const messagesPage = await fetchMessagesPage(
        page.value || 1,
        size.value,
        orderBy.value,
        statuses.value, // Status filter
        dateRange.value.start,
        dateRange.value.end,
        selectedFacility.value,
        nationalId.value
      );
      messages.value = messagesPage.items;
      total.value = messagesPage.total;
      page.value = messagesPage.page;
      size.value = messagesPage.size;

      fetchInProgress.value = false;
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
        () => JSON.stringify(dateRange), // Stringify to watch for actual value changes
        () => JSON.stringify(statuses), // Stringify to watch for actual value changes
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
