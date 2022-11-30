<template>
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@nuxtjs/composition-api";
import { Data, newPlot } from "plotly.js";

import { plotColours } from "~/helpers/colourUtils";

export default defineComponent({
  props: {
    x: {
      type: Array,
      default: null,
    },
    y: {
      type: Array,
      default: null,
    },
    colors: {
      type: Array,
      default: () => {
        return plotColours;
      },
    },
    legend: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: "doughnut",
    },
  },

  setup(props) {
    const data: Data[] = [
      {
        values: props.y as number[],
        labels: props.x as string[],
        type: "pie",
        marker: {
          colors: props.colors as string[],
        },
        hoverinfo: "label+value",
        textinfo: "none",
        hole: 0.5,
      },
    ];

    const layout = {
      autosize: true,
      margin: { l: 10, t: 10, r: 10, b: 10 },
      showlegend: props.legend,
      legend: {
        x: 1,
        y: 0.5,
      },
    };

    const config = { responsive: true };

    onMounted(() => {
      newPlot(props.id, data, layout, config);
    });
  },
});
</script>
