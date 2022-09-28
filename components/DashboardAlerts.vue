<template>
  <div v-if="dash && (dash.warnings.length > 0 || dash.messages.length > 0)">
    <BaseAlertWarning v-for="message in dash.warnings" :key="message" :message="message"> </BaseAlertWarning>
    <BaseAlertInfo v-for="message in dash.messages" :key="message" :message="message"> </BaseAlertInfo>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { DashboardSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseAlertInfo from "~/components/base/BaseAlertInfo.vue";
import BaseAlertWarning from "~/components/base/BaseAlertWarning.vue";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseAlertInfo,
    BaseAlertWarning,
  },
  setup() {
    const { dashboardApi } = useApi();

    // Data refs

    const dash = ref<DashboardSchema>();

    onMounted(() => {
      dashboardApi.getDashboard().then((response) => {
        dash.value = response.data;
      });
    });

    return {
      dash,
    };
  },
});
</script>
