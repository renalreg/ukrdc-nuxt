<template>
  <div>
    <canvas id="doughnut" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'

import { Chart, DoughnutController, ArcElement } from 'chart.js'
Chart.register(DoughnutController, ArcElement)

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: null,
    },
    labels: {
      type: Array,
      default: null,
    },
    colors: {
      type: Array,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    onMounted(() => {
      const canvas = document.getElementById('doughnut') as HTMLCanvasElement
      const options = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: props.data,
              backgroundColor: props.colors,
              hoverOffset: 2,
            },
          ],
          labels: props.labels,
        },
        options: props.options,
      }
      // @ts-ignore
      return new Chart(canvas, options)
    })
  },
})
</script>
