<template>
  <span
    class="inline-flex h-5 items-center rounded-full px-2.5 py-0.5 text-sm font-medium capitalize"
    :class="TagClass()"
  >
    {{ visibility }}
  </span>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    visibility: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    function TagClass(): string[] {
      if (props.visibility === "public") {
        return ["bg-green-100", "text-green-800"];
      } else if (props.visibility === "private") {
        return ["bg-blue-100", "text-blue-800"];
      } else {
        return ["bg-gray-100", "text-gray-800"];
      }
    }

    return { TagClass };
  },
});
</script>
