<template>
  <div>
    <canvas :id="id" />
  </div>
</template>

<script lang="ts">
import { ChartData, ArcElement, Chart, DoughnutController, Legend, LegendItem } from "chart.js";

import { tailwindColours } from "~/helpers/utils/colourUtils";

Chart.register(DoughnutController, ArcElement, Legend);

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
      default: () => {
        return [
          tailwindColours.indigo[400],
          tailwindColours.orange[400],
          tailwindColours.emerald[400],
          tailwindColours.blue[400],
          tailwindColours.rose[400],
          tailwindColours.purple[400],
          tailwindColours.yellow[400],
          tailwindColours.cyan[400],
          tailwindColours.pink[400],
          tailwindColours.lime[400],
          tailwindColours.blue[400],
          tailwindColours.amber[400],
          tailwindColours.teal[400],
          tailwindColours.fuchsia[400],
          tailwindColours.red[400],
          tailwindColours.neutral[400],
          "#63C",
          "#E67300",
          "#8B0707",
          "#329262",
          "#5574A6",
          "#651067",
        ];
      },
    },
    options: {
      type: Object,
      default: null,
    },
    legend: {
      type: Boolean,
      default: true,
    },
    legendLimit: {
      type: Number,
      default: 8,
    },
    id: {
      type: String,
      default: "doughnut",
    },
  },

  setup(props) {
    onMounted(() => {
      const canvas = document.getElementById(props.id) as HTMLCanvasElement;
      const options = {
        type: "doughnut",
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
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: props.legend,
              position: "right",
              labels: {
                filter: (legendItem: LegendItem, data: ChartData) => {
                  const labelIndex: number | undefined = data.labels?.indexOf(legendItem.text);
                  // Hide label if it's not found in the dataset
                  if (labelIndex === -1 || labelIndex === undefined) {
                    return false;
                  }
                  return labelIndex < props.legendLimit;
                },
              },
            },
          },
          ...props.options,
        },
      };
      // @ts-ignore
      return new Chart(canvas, options);
    });
  },
});
</script>
