<template>
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 md:-mx-8">
    <div class="inline-block min-w-full overflow-hidden px-4 py-2 align-middle sm:px-6 md:px-8">
      <BaseCard>
        <table class="min-w-full divide-y divide-gray-300">
          <slot></slot>
        </table>
      </BaseCard>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";

import BaseCard from "~/components/base/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },
});
</script>
