<template>
  <div>
    <canvas :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

import { Interval, DateTime } from 'luxon'

import { Chart, LineController, TimeScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
import 'chartjs-adapter-luxon'

import { HistoryItem } from '~/interfaces/common'

Chart.register(LineController, TimeScale, LinearScale, PointElement, LineElement, Tooltip)

interface EventElement {
  datasetIndex: number
  element: PointElement
  index: number
}

export default defineComponent({
  props: {
    data: {
      type: Array as () => HistoryItem[],
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
    autofillData: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: 'time-series',
    },
    start: {
      type: String,
      required: false,
      default: null,
    },
    end: {
      type: String,
      required: false,
      default: null,
    },
  },

  setup(props, { emit }) {
    const dataToUse = ref<{ [key: string]: number }>({})

    function* iterateDays(interval: Interval) {
      let cursor = interval.start.startOf('day')
      while (cursor < interval.end) {
        yield cursor
        cursor = cursor.plus({ days: 1 })
      }
    }

    function populateData() {
      // Populate base/missing data
      if (props.autofillData) {
        const start = props.start ? DateTime.fromISO(props.start) : DateTime.now().minus({ days: 365 })
        const end = props.end ? DateTime.fromISO(props.end) : DateTime.now()
        const interval = Interval.fromDateTimes(start, end)
        for (const d of iterateDays(interval)) {
          dataToUse.value[d.toISODate()] = 0
        }
      }

      // Populate real data
      for (const item of props.data) {
        dataToUse.value[item.time] = item.count
      }
    }

    onMounted(() => {
      populateData()
      const canvas = document.getElementById(props.id) as HTMLCanvasElement
      const options = {
        type: 'line',
        data: {
          datasets: [
            {
              data: dataToUse.value,
              borderColor: 'rgba(79, 70, 229, 1)',
              backgroundColor: 'rgba(79, 70, 229, 0.5)',
              pointRadius: 0,
              hitRadius: 5,
              hoverRadius: 5,
            },
          ],
        },
        options: {
          onClick: (_: MouseEvent, activeElements: EventElement[]) => {
            if (activeElements && activeElements[0]) {
              emit('click', activeElements[0].element.parsed)
            }
          },
          responsive: true,
          maintainAspectRatio: false,
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

    return { dataToUse }
  },
})
</script>
