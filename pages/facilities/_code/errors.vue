<template>
  <div>
    <!-- Real results -->
    <BaseCard class="mt-4">
      <BaseCardHeader>
        <h2>Records Currently Failing</h2>
        <div class="flex w-full">
          <div class="flex-grow">
            <h5>Records where the most recent message received failed to process due to errors.</h5>
          </div>
          <BaseCollapseHeader v-model="advancedOpen" label="More Options"></BaseCollapseHeader>
        </div>
        <!-- More Options -->
        <div v-show="advancedOpen" class="mt-4">
          <BaseSelectSearchable
            v-if="channelIds.length > 1"
            v-model="selectedChannel"
            :options="channelIds"
            :labels="channelLabels"
            hint="Select a message channel..."
            :show-labels-only="true"
          />
        </div>
      </BaseCardHeader>
      <div v-if="errorMessages && errorMessagesTotal == 0" class="p-8 text-center">
        <p>No active failing records</p>
      </div>
      <div v-else>
        <!-- Skeleton results -->
        <ul v-if="!errorMessages" class="divide-y divide-gray-300">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
        <!-- Real results -->
        <ul class="divide-y divide-gray-300">
          <li v-for="item in errorMessages" :key="item.id" :item="item" class="hover:bg-gray-50">
            <NuxtLink :to="`/messages/${item.id}`">
              <MessagesListItem :item="item" />
            </NuxtLink>
          </li>
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
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter, watch } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, MessageSchema } from "@ukkidney/ukrdc-axios-ts";
import { PlotDatum } from "plotly.js";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseCollapseHeader from "~/components/base/BaseCollapseHeader.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSelectSearchable from "~/components/base/BaseSelectSearchable.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import MessagesListItem from "~/components/messages/MessagesListItem.vue";
import useApi from "~/composables/useApi";
import useChannels from "~/composables/useChannels";
import { getPointDateRange } from "~/helpers/chartUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardHeader,
    BasePaginator,
    BaseSkeleListItem,
    BaseSelectSearchable,
    BaseCollapseHeader,
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
    const { channels, channelIds, channelLabels, selectedChannel } = useChannels();
    const { facilitiesApi } = useApi();

    // Data refs
    const advancedOpen = ref(false);

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
          channel: [selectedChannel.value].filter((n) => n) as string[],
        })
        .then((response) => {
          errorMessages.value = response.data.items;
          errorMessagesPage.value = response.data.page ?? 0;
          errorMessagesSize.value = response.data.size ?? 0;
          errorMessagesTotal.value = response.data.total;
        });
    }

    onMounted(() => {
      // Auto-open advanced options if any are active
      if (selectedChannel.value) {
        advancedOpen.value = true;
      }
      updateErrorMessages();
    });

    watch([errorMessagesPage, selectedChannel], () => {
      updateErrorMessages();
    });

    return {
      advancedOpen,
      errorMessages,
      errorMessagesPage,
      errorMessagesSize,
      errorMessagesTotal,
      historyPointClickHandler,
      channels,
      channelIds,
      channelLabels,
      selectedChannel,
    };
  },
});
</script>
