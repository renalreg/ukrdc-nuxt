<!--
Basic code map description, used in the maps sections of a Code pane.
-->

<template>
  <li>
    <div class="w-full min-w-0 px-4 py-4 sm:px-6">
      <CodeTitle class="inline" :code="map.sourceCode" :coding-standard="map.sourceCodingStandard" />
      <h5 class="mx-2 inline">→</h5>
      <CodeTitle class="inline truncate" :code="map.destinationCode" :coding-standard="map.destinationCodingStandard" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { CodeMapSchema } from "@ukkidney/ukrdc-axios-ts";

import CodeTitle from "~/components/CodeTitle.vue";

export default defineComponent({
  components: {
    CodeTitle,
  },
  props: {
    map: {
      type: Object as () => CodeMapSchema,
      required: true,
    },
  },
});
</script>
