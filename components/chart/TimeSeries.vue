<template>
  <div>
    <canvas id="time-series" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'

import { Chart, ScatterController, TimeScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
import 'chartjs-adapter-luxon'

Chart.register(ScatterController, TimeScale, LinearScale, PointElement, LineElement, Tooltip)

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    onMounted(() => {
      const canvas = document.getElementById('time-series') as HTMLCanvasElement
      const options = {
        type: 'scatter',
        data: {
          datasets: [
            {
              data: props.data,
              borderColor: 'rgba(79, 70, 229, 1)',
              backgroundColor: 'rgba(79, 70, 229, 0.5)',
              pointRadius: 6,
              hoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          parsing: {
            xAxisKey: 'time',
            yAxisKey: 'count',
          },
          scales: {
            x: {
              type: 'time',
              time: {
                format: 'YYYY-MM-DD',
                displayFormats: {
                  quarter: 'MMM YYYY',
                },
              },
              ticks: {
                source: 'auto',
                autoSkip: true,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: props.label,
              },
              ticks: {
                precision: 0,
              },
            },
          },
        },
      }
      // @ts-ignore
      return new Chart(canvas, options)
    })
  },
})
</script>
