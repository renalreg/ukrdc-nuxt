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
import { FacilityDetailsSchema, HistoryPoint, MessageSchema } from "@ukkidney/ukrdc-axios-ts";
import useApi from "~/helpers/useApi";
import { getPointDateRange } from "~/helpers/utils/chartUtils";
import { HistoryPointEvent } from "~/interfaces/charts";

export default defineComponent({
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const { facilitiesApi } = useApi();

    // Data refs
    const facilityErrorsHistory = ref<HistoryPoint[]>();

    // Failing NIs data
    const errorMessages = ref([] as MessageSchema[]);
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

    function updateErrorMessages() {
      facilitiesApi
        .getFacilityPatientsLatestErrors({
          code: props.facility.id,
          page: errorMessagesPage.value,
          size: errorMessagesSize.value,
        })
        .then((response) => {
          errorMessages.value = response.data.items;
          errorMessagesPage.value = response.data.page;
          errorMessagesSize.value = response.data.size;
          errorMessagesTotal.value = response.data.total;
        });
    }

    function updateErrorsHistory() {
      facilitiesApi
        .getFacilityErrrorsHistory({
          code: props.facility.id,
        })
        .then((response) => {
          facilityErrorsHistory.value = response.data;
        });
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
