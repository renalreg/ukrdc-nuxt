<template>
  <span class="inline-flex h-5 items-center rounded-full px-2.5 py-0.5 text-sm font-medium" :class="TagClass()">
    {{ prePostString }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    prePost: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    function TagClass(): string[] {
      if (props.prePost === "PRE") {
        return ["bg-red-100", "text-red-800"];
      } else if (props.prePost === "POST") {
        return ["bg-blue-100", "text-blue-800"];
      } else if (props.prePost === "NA") {
        return ["hidden"];
      } else {
        return ["bg-gray-100", "text-gray-800"];
      }
    }

    const prePostString = computed(() => {
      if (props.prePost === "PRE") {
        return "Pre-Dialysis";
      } else if (props.prePost === "POST") {
        return "Post-Dialysis";
      } else {
        return "";
      }
    });
    return { prePostString, TagClass };
  },
});
</script>
