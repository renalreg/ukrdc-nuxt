<template>
  <div>
    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-gray-900">
        <div v-if="value != undefined">
          {{ title }}
        </div>
        <div v-else class="h-4 animate-pulse bg-gray-200 rounded w-full sm:w-1/2"></div>
      </dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <TextHc v-if="value != undefined">
          {{ value }}
        </TextHc>
        <div v-else class="h-6 animate-pulse bg-gray-200 rounded w-full sm:w-1/4"></div>

        <dashDeltaBadge v-if="delta != undefined" :delta="delta" :invert="invert" />
      </dd>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
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

  setup(props) {
    const delta = computed(() => {
      if (props.previousValue) {
        return props.value - props.previousValue
      } else {
        return null
      }
    })

    return { delta }
  },
})
</script>

<style></style>
