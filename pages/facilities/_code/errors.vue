<template>
  <div>
    <!-- Error history -->
    <GenericCard v-if="facilityErrorsHistory">
      <GenericCardHeader>
        <TextH2> Error History </TextH2>
      </GenericCardHeader>
      <GenericCardContent class="p-4">
        <ChartTimeSeries
          class="h-64"
          :data="facilityErrorsHistory"
          y-label="New Errors"
          @click="historyPointClickHandler"
        />
      </GenericCardContent>
    </GenericCard>

    <!-- Failing NIs -->
    <GenericCard v-if="errorMessages && errorMessagesTotal > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Records Currently Failing </TextH2>
        <TextL1>Records where the most recent message received failed to process due to errors.</TextL1>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in errorMessages" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <GenericPaginator
        class="border-t border-gray-200 bg-white"
        :jump-to-top="false"
        :page="errorMessagesPage"
        :size="errorMessagesSize"
        :total="errorMessagesTotal"
        @next="errorMessagesPage++"
        @prev="errorMessagesPage--"
        @jump="errorMessagesPage = $event"
      />
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter, watch } from "@nuxtjs/composition-api";
import fetchFacilities from "~/helpers/fetch/fetchFacilities";
import { getPointDateRange } from "~/helpers/utils/chartUtils";
import { HistoryPointEvent } from "~/interfaces/charts";
import { HistoryItem } from "~/interfaces/common";
import { Facility } from "~/interfaces/facilities";
import { Message } from "~/interfaces/messages";

export default defineComponent({
  props: {
    facility: {
      type: Object as () => Facility,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const { fetchFacilityErrorsHistory, fetchFacilityPatientsLatestErrorsPage } = fetchFacilities();

    // Data refs
    const facilityErrorsHistory = ref<HistoryItem[]>();

    // Failing NIs data
    const errorMessages = ref([] as Message[]);
    const errorMessagesPage = ref(1);
    const errorMessagesSize = ref(5);
    const errorMessagesTotal = ref(0);

    // History plot click handler

    function historyPointClickHandler(point: HistoryPointEvent) {
      const pointRange = getPointDateRange(point);
      router.push({
        path: "/messages",
        query: {
          since: pointRange.since,
          until: pointRange.until,
          facility: props.facility.id,
          status: ["ERROR", "RESOLVED"],
        },
      });
    }

    // Data fetching

    async function updateErrorMessages(): Promise<void> {
      const errorsPage = await fetchFacilityPatientsLatestErrorsPage(
        props.facility,
        errorMessagesPage.value,
        errorMessagesSize.value,
        null
      );
      // Set related errors
      errorMessages.value = errorsPage.items;
      errorMessagesPage.value = errorsPage.page;
      errorMessagesSize.value = errorsPage.size;
      errorMessagesTotal.value = errorsPage.total;
    }

    async function updateErrorsHistory(): Promise<void> {
      facilityErrorsHistory.value = await fetchFacilityErrorsHistory(props.facility);
    }

    onMounted(() => {
      updateErrorMessages();
      updateErrorsHistory();
    });

    watch(errorMessagesPage, () => {
      updateErrorMessages();
    });

    return {
      facilityErrorsHistory,
      errorMessages,
      errorMessagesPage,
      errorMessagesSize,
      errorMessagesTotal,
      historyPointClickHandler,
    };
  },
});
</script>
