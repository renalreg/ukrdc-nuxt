<template>
  <div>
    <TextH1 class="mb-6">EMPI Management</TextH1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EmpiQuickLink
        title="Merge"
        description="Merge Master Records within the EMPI, moving all Patient Records to a combined Master Record"
        icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        :href="'/empi/merge'"
      />
      <EmpiQuickLink
        class="hidden"
        title="Unlink"
        description="Unlink Person Records and Patient Records from their Master Records within the EMPI"
        icon="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        :href="'/empi/unlink'"
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
