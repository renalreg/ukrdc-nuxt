<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Data Files</h1>
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
      <div class="flex flex-col gap-2 lg:flex-row">
        <BaseCollapseHeader v-model="advancedOpen" class="flex-grow" label="More Options"></BaseCollapseHeader>

        <div class="mr-8 flex items-center gap-4">
          <BaseCheckbox v-model="statuses" label="Stored" value="STORED" />
          <BaseCheckbox v-model="statuses" label="Received" value="RECEIVED" />
          <BaseCheckbox v-model="statuses" label="Error" value="ERROR" />
          <BaseCheckbox v-model="statuses" label="Resolved" value="RESOLVED" />
        </div>

        <form v-show="!nationalId" class="flex" @submit.prevent="nationalId = nationalIdSearchString.trim()">
          <BaseTextBoxMini
            v-model="nationalIdSearchString"
            class="flex-grow rounded-r-none"
            placeholder="Filter by Patient Number"
          ></BaseTextBoxMini>
          <BaseButtonMini anchor="left" type="submit">Go</BaseButtonMini>
        </form>

        <BaseButtonMini v-show="nationalId" @click="nationalId = null">Show Results From All Patients</BaseButtonMini>

        <BaseButtonMini @click="toggleOrder">
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

    <!-- More Options -->
    <div v-show="advancedOpen">
      <BaseSelectSearchable
        v-if="channelIds.length > 1"
        v-model="selectedChannel"
        class="mb-4"
        :options="channelIds"
        :labels="channelLabels"
        hint="Select a message channel..."
        :show-labels-only="true"
      />
    </div>

    <BaseCard>
      <!-- Skeleton results -->
      <div v-if="fetchInProgress">
        <ul v-if="fetchInProgress" class="divide-y divide-gray-300">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
      </div>
      <!-- Real results -->
      <div v-else>
        <ul class="divide-y divide-gray-300">
          <li v-for="item in messages" :key="item.id" class="hover:bg-gray-50">
            <NuxtLink :to="`/messages/${item.id}`">
              <MessagesListItem :item="item" />
            </NuxtLink>
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
import { MessageSchema, OrderBy } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCheckbox from "~/components/base/BaseCheckbox.vue";
import BaseCollapseHeader from "~/components/base/BaseCollapseHeader.vue";
import BaseDateRange from "~/components/base/BaseDateRange.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelectSearchable from "~/components/base/BaseSelectSearchable.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BaseTextBoxMini from "~/components/base/BaseTextBoxMini.vue";
import IconBarsArrowDown from "~/components/icons/hero/20/solid/IconBarsArrowDown.vue";
import IconBarsArrowUp from "~/components/icons/hero/20/solid/IconBarsArrowUp.vue";
import MessagesListItem from "~/components/messages/MessagesListItem.vue";
import useDateRange from "~/composables/query/useDateRange";
import usePagination from "~/composables/query/usePagination";
import useQuery from "~/composables/query/useQuery";
import useSortBy from "~/composables/query/useSortBy";
import useApi from "~/composables/useApi";
import useChannels from "~/composables/useChannels";
import useFacilities from "~/composables/useFacilities";
import usePermissions from "~/composables/usePermissions";
import { nowString } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
    BaseCheckbox,
    BaseTextBoxMini,
    BaseDateRange,
    BaseSelectSearchable,
    BaseCollapseHeader,
    IconBarsArrowDown,
    IconBarsArrowUp,
    MessagesListItem,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { stringQuery, arrayQuery } = useQuery();

    const { facilities, facilityIds, facilityLabels, selectedFacility } = useFacilities();
    const { channels, channelIds, channelLabels, selectedChannel } = useChannels();

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

    const advancedOpen = ref(false);

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
          channel: [selectedChannel.value].filter((n) => n) as string[],
          ni: [nationalId.value].filter((n) => n) as string[],
        })
        .then((response) => {
          messages.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
        })
        .finally(() => {
          fetchInProgress.value = false;
        });
    }

    onMounted(() => {
      // Auto-open advanced options if any are active
      if (selectedChannel.value) {
        advancedOpen.value = true;
      }
      getMessages();
    });

    watch(
      [
        page,
        orderBy,
        selectedFacility,
        selectedChannel,
        nationalId,
        () => JSON.stringify(dateRange.value), // Stringify to watch for actual value changes
        () => JSON.stringify(statuses.value), // Stringify to watch for actual value changes
      ],
      () => {
        getMessages();
      },
    );

    return {
      fetchInProgress,
      advancedOpen,
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
      channels,
      channelIds,
      channelLabels,
      selectedChannel,
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
