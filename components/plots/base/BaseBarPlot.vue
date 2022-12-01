<template>
  <div :id="id" :class="{ 'mb-2': !!xLabel }"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@nuxtjs/composition-api";
import { Data, newPlot, PlotData } from "plotly.js";

import { tailwindColours } from "~/helpers/colourUtils";

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
    yLabel: {
      type: String,
      default: null,
    },
    xLabel: {
      type: String,
      default: null,
    },
    hoverinfo: {
      type: String,
      required: false,
      default: undefined,
    },
    hovertemplate: {
      // Note https://community.plotly.com/t/remove-trace-0-next-to-hover/33731/2
      type: String,
      required: false,
      default: "<extra></extra>",
    },
    fixedrange: {
      type: Boolean,
      required: false,
      default: true,
    },
    orientation: {
      type: String as () => "v" | "h",
      required: false,
      default: "v",
    },
    id: {
      type: String,
      default: "bar",
    },
  },

  setup(props) {
    const data: Data[] = [
      {
        x: (props.orientation === "h" ? props.y : props.x) as number[] | string[],
        y: (props.orientation === "h" ? props.x : props.y) as number[],
        type: "bar",
        orientation: props.orientation as "v" | "h",
        marker: {
          color: tailwindColours.indigo[400],
          opacity: 0.7,
          line: {
            color: tailwindColours.indigo[800],
            width: 1,
          },
        },
        hoverinfo: props.hoverinfo as PlotData["hoverinfo"],
        hovertemplate: props.hovertemplate,
      },
    ];

    const layout = {
      autosize: true,
      bargap: 0.3,
      margin: { t: 10, r: 10, b: 20, l: 20 },
      xaxis: {
        title: props.orientation === "h" ? props.yLabel : props.xLabel,
        fixedrange: props.fixedrange,
        automargin: true,
        titlefont: {
          size: 12,
          color: tailwindColours.gray[600],
        },
      },
      yaxis: {
        title: props.orientation === "h" ? props.xLabel : props.yLabel,
        fixedrange: props.fixedrange,
        automargin: true,
        titlefont: {
          size: 12,
          color: tailwindColours.gray[600],
        },
      },
    };

    const config = {
      responsive: true,
    };

    onMounted(() => {
      newPlot(props.id, data, layout, config);
    });
  },
});
</script>
