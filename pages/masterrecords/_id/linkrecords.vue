<template>
  <div>
    <LoadingIndicator v-if="!linkRecords"></LoadingIndicator>
    <div v-else class="grid grid-cols-1 gap-6">
      <MasterrecordsLinkRecord v-for="link in linkRecords" :key="link.id" :record="link" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";

import { LinkRecordSchema, MasterRecordSchema, MasterRecordStatisticsSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";

import useApi from "~/helpers/useApi";

export default defineComponent({
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

    // Data refs

    const linkRecords = ref<LinkRecordSchema[]>();

    // Data fetching
    onMounted(() => {
      masterRecordsApi
        .getMasterRecordLinkrecords({
          recordId: props.record.id,
        })
        .then((response) => {
          linkRecords.value = response.data;
        });
    });

    return {
      linkRecords,
      formatGender,
      formatDate,
    };
  },
});
</script>

<style></style>
