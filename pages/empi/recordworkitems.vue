<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Records with Open Work Items</h1>
      <h3 class="mb-1">Quickly identifies Master Records with the largest number of open Work Items.</h3>
      <p>
        Note that this does not attempt to group Master Records by their link records.
        <br />
        For example, both the UKRDC and NHS Master Records for a patient will appear here separately.
      </p>
    </div>

    <!-- If loading -->
    <div v-if="fetchInProgress">
      <BaseCard>
        <!-- Skeleton results -->
        <ul class="divide-y divide-gray-200">
          <BaseSkeleListItem v-for="n in 10" :key="n" />
        </ul>
      </BaseCard>
    </div>
    <div v-else>
      <BaseCard>
        <!-- Real results -->
        <ul class="divide-y divide-gray-200">
          <div v-for="group in groups" :key="`group-${group.masterRecord.id}`" class="hover:bg-gray-50">
            <NuxtLink :to="`/masterrecords/${group.masterRecord.id}`">
              <MasterRecordsListItem
                :item="group.masterRecord"
                details-label="Open Work Items"
                :details-value="group.workItemCount.toString()"
              />
            </NuxtLink>
          </div>
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
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { WorkItemGroup } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import BaseSkeleListItem from "~/components/base/BaseSkeleListItem.vue";
import MasterRecordsListItem from "~/components/MasterRecordsListItem.vue";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseSkeleListItem,
    BasePaginator,
    MasterRecordsListItem,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { adminApi } = useApi();

    // Data refs
    size.value = 10; // Get 10 groups as we expect a couple of records per group

    const groups = ref<WorkItemGroup[]>();
    const fetchInProgress = ref(false);

    const lastRunTime = ref<string>();

    // Data fetching
    function getGroups() {
      fetchInProgress.value = true;

      adminApi
        .getRecordWorkitemCounts({
          page: page.value || 1,
          size: size.value,
        })
        .then((response) => {
          groups.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page;
          size.value = response.data.size;

          fetchInProgress.value = false;
        });
    }

    onMounted(() => {
      getGroups();
    });

    watch(page, () => {
      getGroups();
    });

    return {
      groups,
      fetchInProgress,
      lastRunTime,
      page,
      total,
      size,
      formatDate,
    };
  },
});
</script>
