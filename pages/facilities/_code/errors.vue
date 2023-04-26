<template>
  <div>
    <div v-if="errorMessages && errorMessagesTotal == 0" class="text-center">
      <p>No active failing records</p>
    </div>
    <!-- Failing NIs -->
    <!-- Skeleton results -->
    <BaseCard v-if="!errorMessages" class="mt-4">
      <ul class="divide-y divide-gray-200">
        <BaseSkeleListItem v-for="n in 10" :key="n" />
      </ul>
    </BaseCard>
    <!-- Real results -->
    <BaseCard v-if="errorMessages && errorMessagesTotal > 0" class="mt-4">
      <BaseCardHeader>
        <h2>Records Currently Failing</h2>
        <h5>Records where the most recent message received failed to process due to errors.</h5>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in errorMessages" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <BasePaginator
        class="border-t border-gray-200 bg-white"
        :jump-to-top="false"
        :page="errorMessagesPage"
        :size="errorMessagesSize"
        :total="errorMessagesTotal"
        @next="errorMessagesPage++"
        @prev="errorMessagesPage--"
        @jump="errorMessagesPage = $event"
      />
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter, watch } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, MessageSchema } from "@ukkidney/ukrdc-axios-ts";
import { PlotDatum } from "plotly.js";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import MessagesListItem from "~/components/MessagesListItem.vue";
import useApi from "~/composables/useApi";
import { getPointDateRange } from "~/helpers/chartUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardHeader,
    BasePaginator,
    BaseSkeleListItem,
    MessagesListItem,
  },
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const { facilitiesApi } = useApi();

    // Failing NIs data
    const errorMessages = ref<MessageSchema[]>();
    const errorMessagesPage = ref(1);
    const errorMessagesSize = ref(10);
    const errorMessagesTotal = ref(0);
    // History plot click handler
    function historyPointClickHandler(point: PlotDatum) {
      if (point.x) {
        const pointRange = getPointDateRange(point.x as string);
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
          errorMessagesPage.value = response.data.page ?? 0;
          errorMessagesSize.value = response.data.size ?? 0;
          errorMessagesTotal.value = response.data.total;
        });
    }

    onMounted(() => {
      updateErrorMessages();
    });
    watch(errorMessagesPage, () => {
      updateErrorMessages();
    });
    return {
      errorMessages,
      errorMessagesPage,
      errorMessagesSize,
      errorMessagesTotal,
      historyPointClickHandler,
    };
  },
});
</script>
