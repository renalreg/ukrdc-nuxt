<template>
  <span :class="active ? 'opacity-100' : 'opacity-40'" class="cursor-pointer" @click="$emit('toggle')">
    <IconMiniSortAscending v-show="asc" class="ml-2" />
    <IconMiniSortDescending v-show="!asc" class="ml-2" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    asc: {
      type: Boolean,
      required: false,
      default: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
