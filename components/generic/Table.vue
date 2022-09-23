<template>
  <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 md:-mx-8">
    <div class="inline-block min-w-full overflow-hidden py-2 px-4 align-middle sm:px-6 md:px-8">
      <BaseCard>
        <table class="min-w-full divide-y divide-gray-200">
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
