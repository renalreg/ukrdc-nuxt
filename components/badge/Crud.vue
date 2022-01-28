<template>
  <span
    class="inline-flex h-5 items-center rounded-full px-2.5 py-0.5 text-sm font-medium"
    :class="TagClass(operation)"
  >
    {{ operation.trim() }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    operation: {
      type: String,
      required: true,
    },
  },

  setup() {
    function TagClass(operation: string): string[] {
      if (operation.includes("DELETE")) {
        return ["bg-red-100", "text-red-800"];
      } else if (operation.includes("READ")) {
        return ["bg-blue-100", "text-blue-800"];
      } else if (operation.includes("UPDATE")) {
        return ["bg-purple-100", "text-purple-800"];
      } else if (operation.includes("CREATE")) {
        return ["bg-green-100", "text-green-800"];
      } else {
        return ["bg-gray-100", "text-gray-800"];
      }
    }

    return { TagClass };
  },
});
</script>
