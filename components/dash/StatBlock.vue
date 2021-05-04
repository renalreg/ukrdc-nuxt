<template>
  <div>
    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-gray-900">
        <div v-if="value != undefined">
          {{ title }}
        </div>
        <div
          v-else
          class="h-4 animate-pulse bg-gray-200 rounded w-full sm:w-1/2"
        ></div>
      </dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div
          v-if="value != undefined"
          class="flex items-baseline text-2xl font-semibold text-indigo-600"
        >
          {{ value }}
        </div>
        <div
          v-else
          class="h-6 animate-pulse bg-gray-200 rounded w-full sm:w-1/4"
        ></div>

        <dashDeltaBadge
          v-if="delta != undefined"
          :delta="delta"
          :invert="invert"
        />
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
      required: false,
      default: undefined,
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
