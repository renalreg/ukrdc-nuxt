<template>
  <li>
    <div class="px-4 sm:px-6 py-4 min-w-0 grid grid-cols-2 lg:grid-cols-3 md:gap-4 w-full">
      <!-- Heading -->
      <div class="col-span-2">
        <CodesTitle class="inline" :code="map.sourceCode" :coding-standard="map.sourceCodingStandard" />
        <TextL1 class="inline mx-2">→</TextL1>
        <CodesTitle
          class="inline truncate"
          :code="map.destinationCode"
          :coding-standard="map.destinationCodingStandard"
        />
      </div>
      <!-- Extra fields  -->
      <div class="hidden lg:block col-span-1"></div>
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
