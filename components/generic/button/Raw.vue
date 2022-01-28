<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button :aria-label="label" type="button" @click="navigate">
      <slot />
    </button>
  </router-link>
  <button v-else :aria-label="label" type="button" @click="$emit('click')">
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    to: {
      type: [Object, String],
      required: false,
      default: null,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>
