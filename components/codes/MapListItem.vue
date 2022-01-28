<!--
Basic code map description, used in the maps sections of a Code pane.
-->

<template>
  <li>
    <div class="w-full min-w-0 px-4 py-4 sm:px-6">
      <CodesTitle class="inline" :code="map.sourceCode" :coding-standard="map.sourceCodingStandard" />
      <TextL1 class="mx-2 inline">→</TextL1>
      <CodesTitle
        class="inline truncate"
        :code="map.destinationCode"
        :coding-standard="map.destinationCodingStandard"
      />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { CodeMap } from '@/interfaces/codes'

export default defineComponent({
  props: {
    map: {
      type: Object as () => CodeMap,
      required: true,
    },
  },
})
</script>
