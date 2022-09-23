<template>
  <div>
    <div v-if="stats && stats.errors == 0 && stats.workitems == 0 && stats.ukrdcids == 1" class="text-center">
      <TextP>No issues on record</TextP>
    </div>

    <!-- Multiple UKRDC IDs -->
    <BaseCard v-if="ukrdcIdGroup" class="mb-4">
      <empiMultipleIDItem :group="ukrdcIdGroup" heading="Multiple UKRDC IDs" />
    </BaseCard>

    <!-- Related Work Items card -->
    <BaseCard v-if="workItems && workItems.length > 0" class="mt-4">
      <BaseCardHeader>
        <TextH2> Open Work Items </TextH2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in workItems" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </BaseCard>

    <!-- Related errors card -->
    <BaseCard v-if="relatedErrors && relatedErrors.length > 0" class="mt-4">
      <BaseCardHeader>
        <TextH2> Record Errors </TextH2>
      </BaseCardHeader>
      <ul class="divide-y divide-gray-200">
        <div v-for="item in relatedErrors" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/messages/${item.id}`">
            <MessagesListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
      <GenericPaginator
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
  WorkItemSchema,
} from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";

import usePermissions from "~/composables/usePermissions";
import useApi from "~/composables/useApi";

interface MultipleUKRDCIDsGroupItem {
  lastUpdated: string | null;
  masterRecord: MasterRecordSchema;
}

export interface MultipleUKRDCIDsGroup {
  groupId: number | null;
  records: MultipleUKRDCIDsGroupItem[];
}

export default defineComponent({
  components: {
    BaseCard,
    BaseCardHeader,
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
    const workItems = ref([] as WorkItemSchema[]);

    const relatedErrors = ref([] as MessageSchema[]);
    const relatedErrorsPage = ref(1);
    const relatedErrorsSize = ref(5);
    const relatedErrorsTotal = ref(0);

    const ukrdcIdGroup = ref<MultipleUKRDCIDsGroup>();
    const hasMultipleUKRDCIDs = ref(false);

    // Data fetching

    function fetchWorkItems() {
      // Use the record links to load related data concurrently
      if (hasPermission("ukrdc:workitems:read")) {
        masterRecordsApi
          .getMasterRecordWorkitems({
            recordId: props.record.id,
          })
          .then((response) => {
            workItems.value = response.data;
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
          relatedErrorsPage.value = response.data.page;
          relatedErrorsSize.value = response.data.size;
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
              groupId: null,
              records: [],
            } as MultipleUKRDCIDsGroup;

            for (const record of response.data) {
              multipleIdsGroup.records.push({
                lastUpdated: null,
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

    watch(relatedErrorsPage, () => {
      updateRelatedErrors();
    });

    watch(
      () => props.stats,
      () => {
        fetchMultipleUKRDCIds();
      }
    );

    return {
      workItems,
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
      ukrdcIdGroup,
      formatGender,
      formatDate,
    };
  },
});
</script>

<style></style>
