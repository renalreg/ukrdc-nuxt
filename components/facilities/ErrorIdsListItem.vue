<template>
  <li>
    <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-2 items-center gap-2 w-full">
      <!-- Identifiers  -->
      <div class="flex gap-2">
        <TextL1>Patient Number</TextL1>
        <TextP>
          {{ ni }}
        </TextP>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <GenericButtonMini
          :to="{ path: '/messages', query: { nationalid: ni } }"
          tooltip="Show errors for this patient"
          class="flex-1 h-8 truncate"
        >
          Show Errors
        </GenericButtonMini>
        <GenericButtonMini
          :to="{ path: '/masterrecords', query: { search: ni } }"
          tooltip="Search records for this patient"
          class="flex-1 h-8 truncate"
        >
          Find Record
        </GenericButtonMini>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    ni: {
      type: String,
      required: true,
    },
  },
})
</script>
