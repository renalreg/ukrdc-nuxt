<template>
  <div>
    <h1 class="mb-4">Enterprise Master Patient Index</h1>
    <h2 class="mb-4">EMPI Management</h2>
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <QuickLink
        title="Merge"
        description="Merge Master Records within the EMPI, moving all Patient Records to a combined Master Record"
        icon="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
        href="/empi/merge"
      />
    </div>
    <h2 class="mb-4">EMPI Health</h2>
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <QuickLink
        title="Multiple UKRDC IDs"
        description="View and manage patients with multiple UKRDC IDs"
        icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        href="/empi/multipleids"
      />
      <QuickLink
        title="Record Work Items"
        description="View records with the largest number of open Work Items"
        icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        href="/empi/recordworkitems"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import QuickLink from "~/components/QuickLink.vue";

export default defineComponent({
  components: {
    QuickLink,
  },
});
</script>
