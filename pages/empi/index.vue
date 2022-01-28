<template>
  <div>
    <TextH2 class="mb-4">EMPI Management</TextH2>
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <EmpiQuickLink
        title="Merge"
        description="Merge Master Records within the EMPI, moving all Patient Records to a combined Master Record"
        icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        :href="'/empi/merge'"
      />
    </div>
    <TextH2 class="mb-4">EMPI Health</TextH2>
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <EmpiQuickLink
        title="Multiple UKRDC IDs"
        description="View and manage patients with multiple UKRDC IDs"
        icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        :href="'/empi/multipleids'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {},
})
</script>
