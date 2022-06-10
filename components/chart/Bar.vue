<template>
  <div>
    <canvas :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@nuxtjs/composition-api";

import { BarElement, Chart, BarController, CategoryScale } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale);

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
    id: {
      type: String,
      default: "bar",
    },
  },

  setup(props) {
    onMounted(() => {
      const canvas = document.getElementById(props.id) as HTMLCanvasElement;
      const options = {
        type: "bar",
        data: {
          datasets: [
            {
              data: props.data,
              borderColor: "rgba(79, 70, 229, 1)",
              backgroundColor: "rgba(79, 70, 229, 0.5)",
              borderWidth: 1,
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
            },
          },
          scales: {
            x: {
              title: {
                display: !!props.xLabel,
                text: props.xLabel,
              },
            },
            y: {
              title: {
                display: !!props.yLabel,
                text: props.yLabel,
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
