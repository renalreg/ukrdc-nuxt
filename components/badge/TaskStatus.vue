<template>
  <span
    class="inline-flex h-5 items-center rounded-full px-2.5 py-0.5 text-sm font-medium capitalize"
    :class="TagClass()"
  >
    {{ status }}
  </span>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    status: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    function TagClass(): string[] {
      if (props.status === "pending") {
        return ["bg-blue-100", "text-blue-800"];
      } else if (props.status === "running") {
        return ["bg-yellow-100", "text-yellow-800"];
      } else if (props.status === "finished") {
        return ["bg-green-100", "text-green-800"];
      } else if (props.status === "failed") {
        return ["bg-red-100", "text-red-800"];
      } else {
        return ["bg-gray-100", "text-gray-800"];
      }
    }

    return { TagClass };
  },
});
</script>
