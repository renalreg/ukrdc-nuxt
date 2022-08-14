<template>
  <div>
    <canvas :id="id" />
  </div>
</template>

<script lang="ts">
import { Interval, DateTime } from "luxon";

import { Chart, LineController, TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-luxon";

import { HistoryItem } from "~/interfaces/common";

Chart.register(LineController, TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface EventElement {
  datasetIndex: number;
  element: PointElement;
  index: number;
}

export default defineComponent({
  props: {
    data: {
      type: Array as () => HistoryItem[],
      default: null,
    },
    yLabel: {
      type: String,
      default: null,
    },
    xLabel: {
      type: String,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
    legend: {
      type: Boolean,
      default: false,
    },
    autofillData: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: "time-series",
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
    const dataToUse = ref<{ [key: string]: number }>({});

    function* iterateDays(interval: Interval) {
      let cursor = interval.start.startOf("day");
      while (cursor < interval.end) {
        yield cursor;
        cursor = cursor.plus({ days: 1 });
      }
    }

    function populateData() {
      // Populate base/missing data
      if (props.autofillData) {
        const start = props.start ? DateTime.fromISO(props.start) : DateTime.now().minus({ days: 365 });
        const end = props.end ? DateTime.fromISO(props.end) : DateTime.now();
        const interval = Interval.fromDateTimes(start, end);
        for (const d of iterateDays(interval)) {
          dataToUse.value[d.toISODate()] = 0;
        }
      }

      // Populate real data
      for (const item of props.data) {
        dataToUse.value[item.time] = item.count;
      }
    }

    onMounted(() => {
      populateData();
      const canvas = document.getElementById(props.id) as HTMLCanvasElement;
      const options = {
        type: "line",
        data: {
          datasets: [
            {
              data: dataToUse.value,
              borderColor: "rgba(79, 70, 229, 1)",
              backgroundColor: "rgba(79, 70, 229, 0.5)",
              pointRadius: 0,
              hitRadius: 5,
              hoverRadius: 5,
            },
          ],
        },
        options: {
          onClick: (_: MouseEvent, activeElements: EventElement[]) => {
            if (activeElements && activeElements[0]) {
              const pointEl = activeElements[0].element;
              // @ts-ignore
              // TODO: We only used to need pointEl.parsed, but as of chart.js 3.7.0,
              // it's always returning undefined. pointEl.$context.parsed seems to work,
              // but it's not documented, and doesn't appear in the TypeScript definitions,
              // so we'll just use it for now and ignore TS for this line.
              const parsed = pointEl.parsed || pointEl.$context.parsed;
              emit("click", parsed);
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: props.legend,
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                format: "YYYY-MM-DD",
                displayFormats: {
                  quarter: "MMM YYYY",
                },
              },
              ticks: {
                source: "auto",
                autoSkip: true,
              },
              title: {
                display: !!props.xLabel,
                text: props.xLabel,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: !!props.yLabel,
                text: props.yLabel,
              },
              ticks: {
                precision: 0,
              },
            },
          },
          ...props.options,
        },
      };
      // @ts-ignore
      return new Chart(canvas, options);
    });

    return { dataToUse };
  },
});
</script>
