<template>
  <div>
    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-gray-900">{{ title }}</dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
          {{ value }}
        </div>

        <dashDeltaBadge v-if="delta" :delta="delta" :invert="invert" />
      </dd>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    previousValue: {
      type: Number,
      required: false,
      default: null,
    },
    invert: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    delta(): number | null {
      if (this.previousValue) {
        return this.value - this.previousValue
      } else {
        return null
      }
    },
  },

  methods: {},
})
</script>

<style></style>
