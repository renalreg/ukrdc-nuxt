<template>
  <div>
    <!-- Multiple UKRDC IDs -->
    <BaseCard v-if="ukrdcIdGroup" class="mb-4">
      <EMPIMultipleIDItem :group="ukrdcIdGroup" heading="Multiple UKRDC IDs" />
    </BaseCard>

    <!-- Related Work Items card -->
    <BaseCard class="mt-4">
      <BaseCardHeader class="flex items-center">
        <h2 class="flex-grow">Work Items</h2>
        <BaseTabsModel v-model="currentWorkItemStatusTab" :tabs="workItemStatusTabs" :mini="true" />
      </BaseCardHeader>
      <!-- Skeleton results -->
      <ul v-if="workItemsFetchInProgress" class="divide-y divide-gray-300">
        <BaseSkeleListItem v-for="n in 5" :key="n" />
      </ul>
      <!-- Real results -->
      <ul v-else-if="workItems && workItems.length > 0" class="divide-y divide-gray-300">
        <li v-for="item in workItems" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <WorkItemsListItem :item="item" />
          </NuxtLink>
        </li>
      </ul>
      <div v-else class="p-4 text-center">
        <p>No work items on record</p>
      </div>
    </BaseCard>

    <!-- Related errors card -->
    <!-- Skeleton results -->
    <BaseCard v-if="!relatedErrors" class="mt-4">
      <ul class="divide-y divide-gray-300">
        <BaseSkeleListItem v-for="n in 5" :key="n" />
      </ul>
    </BaseCard>
    <!-- Real results -->
    <BaseCard v-if="relatedErrors && relatedErrors.length > 0" class="mt-4">
      <BaseCardHeader>
        <h2>Record Errors</h2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-300">
        <li v-for="item in relatedErrors" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
          </NuxtLink>
        </li>
      </ul>
      <BasePaginator
        class="border-t border-gray-200 bg-white"
        :jump-to-top="false"
        :page="relatedErrorsPage"
        :size="relatedErrorsSize"
        :total="relatedErrorsTotal"
        @next="relatedErrorsPage++"
        @prev="relatedErrorsPage--"
        @jump="relatedErrorsPage = $event"
      />
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import {
  MasterRecordSchema,
  MasterRecordStatisticsSchema,
  MessageSchema,
  MultipleUKRDCIDGroup,
  WorkItemSchema,
} from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import BaseTabsModel from "~/components/base/BaseTabsModel.vue";
import EMPIMultipleIDItem from "~/components/EMPIMultipleIDItem.vue";
import MessagesListItem from "~/components/messages/MessagesListItem.vue";
import WorkItemsListItem from "~/components/workitem/WorkItemsListItem.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate, nowString } from "~/helpers/dateUtils";
import { workItemStatusTabs } from "~/helpers/workItemUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardHeader,
    BasePaginator,
    BaseSkeleListItem,
    BaseTabsModel,
    MessagesListItem,
    EMPIMultipleIDItem,
    WorkItemsListItem,
  },
  props: {
    record: {
      type: Object as () => MasterRecordSchema,
      required: true,
    },
    stats: {
      type: Object as () => MasterRecordStatisticsSchema,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const { masterRecordsApi } = useApi();
    const { hasPermission } = usePermissions();

    // Data refs
    const workItems = ref<WorkItemSchema[]>();

    const relatedErrors = ref<MessageSchema[]>();
    const relatedErrorsPage = ref(1);
    const relatedErrorsSize = ref(5);
    const relatedErrorsTotal = ref(0);

    const ukrdcIdGroup = ref<MultipleUKRDCIDGroup>();
    const hasMultipleUKRDCIDs = ref(false);

    // Work item status tab
    const currentWorkItemStatusTab = ref<number>(1);

    // Data fetching

    const workItemsFetchInProgress = ref(false);

    function fetchWorkItems() {
      // Use the record links to load related data concurrently
      if (hasPermission("ukrdc:workitems:read")) {
        workItemsFetchInProgress.value = true;

        masterRecordsApi
          .getMasterRecordWorkitems({
            recordId: props.record.id,
            status: [currentWorkItemStatusTab.value],
          })
          .then((response) => {
            workItems.value = response.data;
          })
          .finally(() => {
            workItemsFetchInProgress.value = false;
          });
      }
    }

    function updateRelatedErrors() {
      masterRecordsApi
        .getMasterRecordMessages({
          recordId: props.record.id,
          page: relatedErrorsPage.value || 1,
          size: relatedErrorsSize.value,
          orderBy: "desc",
          status: ["ERROR"],
        })
        .then((response) => {
          relatedErrors.value = response.data.items;
          relatedErrorsPage.value = response.data.page ?? 0;
          relatedErrorsSize.value = response.data.size ?? 0;
          relatedErrorsTotal.value = response.data.total;
        });
    }

    function fetchMultipleUKRDCIds() {
      // If we haven't already fetched the multiple records, and multiple records exist
      if (!hasMultipleUKRDCIDs.value && props.stats?.ukrdcids > 1) {
        // Stop the request from triggering again
        hasMultipleUKRDCIDs.value = true;

        masterRecordsApi
          .getMasterRecordRelated({
            recordId: props.record.id,
            excludeSelf: false,
            nationalidType: "UKRDC",
          })
          .then((response) => {
            // Create a "synthetic" MultipleUKRDCIDsGroup
            // We do this so that we can re-use the component used in the EMPI Data Health page
            const multipleIdsGroup = {
              groupId: 0,
              records: [],
            } as MultipleUKRDCIDGroup;

            for (const record of response.data) {
              multipleIdsGroup.records.push({
                lastUpdated: nowString() ?? "Unknown",
                masterRecord: record,
              });
            }
            ukrdcIdGroup.value = multipleIdsGroup;
          });
      }
    }

    onMounted(() => {
      fetchMultipleUKRDCIds();
      fetchWorkItems();
      updateRelatedErrors();
    });

    watch(currentWorkItemStatusTab, () => {
      fetchWorkItems();
    });

    watch(relatedErrorsPage, () => {
      updateRelatedErrors();
    });

    watch(
      () => props.stats,
      () => {
        fetchMultipleUKRDCIds();
      },
    );

    return {
      workItems,
      workItemsFetchInProgress,
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
      ukrdcIdGroup,
      workItemStatusTabs,
      currentWorkItemStatusTab,
      formatGender,
      formatDate,
    };
  },
});
</script>

<style></style>
