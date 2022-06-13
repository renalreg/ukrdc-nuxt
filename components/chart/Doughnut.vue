<template>
  <div>
    <canvas :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@nuxtjs/composition-api";
import { ChartData, ArcElement, Chart, DoughnutController, Legend, LegendItem } from "chart.js";

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
          "#3366CC",
          "#DC3912",
          "#FF9900",
          "#109618",
          "#990099",
          "#3B3EAC",
          "#0099C6",
          "#D47",
          "#6A0",
          "#B82E2E",
          "#316395",
          "#949",
          "#2A9",
          "#AA1",
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
