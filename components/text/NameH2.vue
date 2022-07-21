<template>
  <span>
    <TextH2 class="inline capitalize" :class="highlight.includes('givenname') ? highlightClasses : []">{{
      forename.toLowerCase()
    }}</TextH2>
    <TextH2 class="inline capitalize italic" :class="highlight.includes('surname') ? highlightClasses : []">{{
      surname.toLowerCase()
    }}</TextH2>
  </span>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    forename: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    highlight: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
  },
  setup() {
    const highlightClasses = ["bg-red-100", "text-red-800", "font-medium", "rounded-md"];

    return {
      highlightClasses,
    };
  },
});
</script>
