<template>
  <div v-if="dash && (dash.warnings.length > 0 || dash.messages.length > 0)">
    <genericAlertWarning v-for="message in dash.warnings" :key="message" :message="message"> </genericAlertWarning>
    <genericAlertInfo v-for="message in dash.messages" :key="message" :message="message"> </genericAlertInfo>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { DashResponse } from "@/interfaces/dash";

import fetchDash from "~/helpers/fetch/fetchDash";

export default defineComponent({
  setup() {
    const { fetchDashboard } = fetchDash();

    // Data refs

    const dash = ref<DashResponse>();

    onMounted(async () => {
      dash.value = await fetchDashboard();
    });

    return {
      dash,
    };
  },
});
</script>
