<template>
  <span :class="active ? 'opacity-100' : 'opacity-40'" class="cursor-pointer" @click="$emit('toggle')">
    <IconMiniFilter />
  </span>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
