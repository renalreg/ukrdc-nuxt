<template>
  <span
    class="inline-flex h-5 items-center rounded-full px-2.5 py-0.5 text-sm font-medium"
    :class="TagClass(nationalidType)"
  >
    {{ nationalidType.trim() }}
  </span>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    nationalidType: {
      type: String,
      required: true,
    },
  },

  setup() {
    function TagClass(nationalidType: string): string[] {
      if (nationalidType.trim().endsWith("UKRDC")) {
        return ["bg-red-100", "text-red-800"];
      } else if (nationalidType.trim().endsWith("NHS")) {
        return ["bg-blue-100", "text-blue-800"];
      } else if (nationalidType.trim().endsWith("CHI")) {
        return ["bg-purple-100", "text-purple-800"];
      } else if (nationalidType.trim().endsWith("HSC")) {
        return ["bg-green-100", "text-green-800"];
      } else {
        return ["bg-gray-100", "text-gray-800"];
      }
    }

    return { TagClass };
  },
});
</script>

<style></style>
