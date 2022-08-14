<template>
  <div>
    <!-- Issues alert -->
    <div v-if="stats && stats.ukrdcids > 1">
      <NuxtLink :to="`/masterrecords/${record.id}/issues`">
        <GenericAlertError
          class="mb-4"
          :message="`${stats.ukrdcids} UKRDC IDs found for this patient. Click for details.`"
        />
      </NuxtLink>
    </div>

    <div v-if="issueMessage">
      <NuxtLink :to="`/masterrecords/${record.id}/issues`">
        <GenericAlertWarning class="mb-4" :message="issueMessage" />
      </NuxtLink>
    </div>

    <div v-if="record" class="mb-2">
      <TextNameH1 :forename="record.givenname" :surname="record.surname" />
      <TextL1> {{ record.nationalidType }} record </TextL1>
    </div>

    <div class="mb-6"><GenericTabsNavigation :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" :stats="stats" />
  </div>
</template>

<script lang="ts">
import { MasterRecordSchema, MasterRecordStatisticsSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";
import { insertIf } from "@/helpers/utils/arrayUtils";

import { TabItem } from "~/interfaces/tabs";
import usePermissions from "~/helpers/usePermissions";
import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { masterRecordsApi } = useApi();
    const { hasPermission } = usePermissions();

    // Head
    useHead({
      title: computed(() => `Record ${route.params.id}`),
    });

    // Navigation

    const tabs = [
      {
        name: "Overview",
        href: `/masterrecords/${route.params.id}`,
      },
      ...insertIf(hasPermission("ukrdc:messages:read"), {
        name: "Data Files",
        href: `/masterrecords/${route.params.id}/messages`,
      }),
      {
        name: "Link Records",
        href: `/masterrecords/${route.params.id}/linkrecords`,
      },
      {
        name: "Issues",
        href: `/masterrecords/${route.params.id}/issues`,
      },
      ...insertIf(hasPermission("ukrdc:audit:records:read"), {
        name: "Audit",
        href: `/masterrecords/${route.params.id}/audit`,
      }),
    ] as TabItem[];

    // Data refs

    const record = ref<MasterRecordSchema>();
    const stats = ref<MasterRecordStatisticsSchema>();

    // Data fetching

    function fetchRecord() {
      masterRecordsApi
        .getMasterRecord({
          recordId: Number(route.params.id),
        })
        .then((response) => {
          record.value = response.data;
        });

      // Get basic record statistics
      masterRecordsApi
        .getMasterRecordStatistics({
          recordId: Number(route.value.params.id),
        })
        .then((response) => {
          stats.value = response.data;
        });

      // Generate issues warning message
      issueMessage.value = buildErrorMessage(stats.value);
    }

    onMounted(() => {
      fetchRecord();
    });

    // Dynamic UI elements

    const issueMessage = ref<string>();

    function buildErrorMessage(stats?: MasterRecordStatisticsSchema): string {
      let msg = "";
      let workItemsMsg = "";
      let errorMsg = "";
      if (stats) {
        if (stats?.workitems > 0) {
          workItemsMsg += `${stats?.workitems} workitem`;
        }
        if (stats?.workitems > 1) {
          workItemsMsg += "s";
        }
        if (stats?.errors > 0) {
          errorMsg += `${stats?.errors} error`;
        }
        if (stats?.errors > 1) {
          errorMsg += "s";
        }
      }
      if (workItemsMsg) {
        msg += workItemsMsg;
      }
      if (workItemsMsg && errorMsg) {
        msg += " and ";
      }
      if (errorMsg) {
        msg += errorMsg;
      }
      if (workItemsMsg || errorMsg) {
        msg += " found on record. Click for details.";
      }
      return msg;
    }

    return {
      tabs,
      record,
      stats,
      issueMessage,
      formatGender,
      formatDate,
    };
  },
});
</script>

<style></style>
