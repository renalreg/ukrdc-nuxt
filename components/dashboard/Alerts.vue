<template>
  <div v-if="dash && (dash.warnings.length > 0 || dash.messages.length > 0)">
    <genericAlertWarning v-for="message in dash.warnings" :key="message" :message="message"> </genericAlertWarning>
    <genericAlertInfo v-for="message in dash.messages" :key="message" :message="message"> </genericAlertInfo>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { DashboardSchema } from "@ukkidney/ukrdc-axios-ts";
import useApi from "~/helpers/useApi";

export default defineComponent({
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
