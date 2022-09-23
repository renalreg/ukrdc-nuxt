<template>
  <div>
    <div class="mx-auto mb-4 max-w-7xl">
      <TextH1>Multiple UKRDC IDs</TextH1>
      <TextP>Results of a scan that detect patients with more than one UKRDC Master Record.</TextP>
    </div>

    <!-- Description list -->
    <BaseCard class="mb-6">
      <BaseCardContent>
        <GenericDlGrid>
          <GenericDlGridItem>
            <TextDt>Patients with Multiple UKRDC IDs</TextDt>
            <TextDd v-if="total">
              {{ total }}
            </TextDd>
            <SkeleText v-else class="mt-2 h-6 w-8" />
          </GenericDlGridItem>

          <GenericDlGridItem>
            <TextDt class="flex items-center gap-1">
              <span class="inline">Last Full Scan</span>
              <GenericInfoIcon class="inline">
                <p>
                  New results are identified weekly by a <b>Full Scan</b>, but existing results are re-checked hourly,
                  see <b>Last checked</b>.
                </p>
                <p>Resolved items will remain in this view until the next check.</p>
              </GenericInfoIcon>
            </TextDt>
            <TextDd v-if="lastRunTime">
              {{ formatDate(lastRunTime, true) }}
            </TextDd>
            <SkeleText v-else class="mt-2 h-6 w-1/4" />
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
import { formatDate } from "~/helpers/dateUtils";

import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseLoadingIndicator,
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
