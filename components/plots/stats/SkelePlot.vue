<!-- eslint-disable vue/no-v-html -->
<template>
  <BaseSkeleDiv class="h-72 w-full">
    <div class="flex h-full w-full flex-col items-center justify-center">
      <p>{{ loadingText }}</p>
    </div>
  </BaseSkeleDiv>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

import BaseSkeleDiv from "~/components/base/BaseSkeleDiv.vue";
import useTimer from "~/composables/useTimer";

export default defineComponent({
  components: {
    BaseSkeleDiv,
  },
  setup() {
    const { timeSinceMount } = useTimer();

    const loadingText = computed<string>(() => {
      if (timeSinceMount.value >= 30) {
        return "An internal error may have occurred. Please try again later.";
      }
      if (timeSinceMount.value >= 10) {
        return "Calculations are taking longer than usual...";
      }
      if (timeSinceMount.value >= 1) {
        return "Calculating...";
      }
      return "";
    });

    return {
      loadingText,
    };
  },
});
</script>
