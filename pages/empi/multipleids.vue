<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <h1>Multiple UKRDC IDs</h1>
      <p>Results of a scan that detect patients with more than one UKRDC Master Record.</p>
    </div>

    <!-- Description list -->
    <BaseCard class="mb-6">
      <BaseCardContent>
        <GenericDlGrid>
          <GenericDlGridItem>
            <dt>Patients with Multiple UKRDC IDs</dt>
            <dd v-if="total">
              {{ total }}
            </dd>
            <BaseSkeleText v-else class="mt-2 h-6 w-8" />
          </GenericDlGridItem>

          <GenericDlGridItem>
            <dt class="flex items-center gap-1">
              <span class="inline">Last Full Scan</span>
              <GenericInfoIcon class="inline">
                <p>
                  New results are identified weekly by a <b>Full Scan</b>, but existing results are re-checked hourly,
                  see <b>Last checked</b>.
                </p>
                <p>Resolved items will remain in this view until the next check.</p>
              </GenericInfoIcon>
            </dt>
            <dd v-if="lastRunTime">
              {{ formatDate(lastRunTime, true) }}
            </dd>
            <BaseSkeleText v-else class="mt-2 h-6 w-1/4" />
          </GenericDlGridItem>
        </GenericDlGrid>
      </BaseCardContent>
    </BaseCard>

    <div v-if="groups">
      <div v-for="group in groups" :key="`group-${group.groupId}`">
        <BaseCard class="mb-4">
          <empiMultipleIDItem :group="group" :fetch-in-progress="fetchInProgress" />
        </BaseCard>
      </div>

      <BaseCard>
        <GenericPaginator
          class="bg-white"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </BaseCard>
    </div>
    <BaseLoadingIndicator v-else></BaseLoadingIndicator>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { MultipleUKRDCIDGroup } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseLoadingIndicator from "~/components/base/BaseLoadingIndicator.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import { formatDate } from "~/helpers/dateUtils";

import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseLoadingIndicator,
    BaseSkeleText,
  },
  setup() {
    const { page, total, size } = usePagination();
    const { adminApi } = useApi();

    // Data refs
    size.value = 10; // Get 10 groups as we expect a couple of records per group

    const groups = ref<MultipleUKRDCIDGroup[]>();
    const fetchInProgress = ref(false);

    const lastRunTime = ref<string>();

    // Data fetching
    function getGroups() {
      fetchInProgress.value = true;

      adminApi
        .getDatahealthMultipleUkrdcids({
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

      adminApi.getDatahealthMultipleUkrdcidsLastRun().then((response) => {
        lastRunTime.value = response.data.lastRunTime;
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
