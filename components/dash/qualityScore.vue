<template>
  <h1 class="text-6xl font-semibold text-indigo-600">
    {{ grade }}
  </h1>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const roundedPct = computed(() => {
      return Math.round(props.percent)
    })

    const grade = computed(() => {
      if (roundedPct.value >= 95) {
        return 'A+'
      }
      if (roundedPct.value >= 90) {
        return 'A'
      }
      if (roundedPct.value >= 80) {
        return 'A-'
      }
      if (roundedPct.value >= 70) {
        return 'B'
      }
      if (roundedPct.value >= 60) {
        return 'C'
      }
      if (roundedPct.value >= 50) {
        return 'D'
      }
      if (roundedPct.value >= 30) {
        return 'E'
      }
      return 'F'
    })

    return {
      roundedPct,
      grade,
    }
  },
})
</script>

<style scoped></style>
