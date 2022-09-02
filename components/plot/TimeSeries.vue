<template>
  <div :id="id" :class="{ 'mb-2': !!xLabel }"></div>
</template>

<script lang="ts">
import { Data, PlotData, newPlot } from "plotly.js";
import { tailwindColours } from "~/helpers/utils/colourUtils";

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
      default: undefined,
    },
    fixedrange: {
      type: Boolean,
      required: false,
      default: true,
    },
    id: {
      type: String,
      default: "bar",
    },
  },

  setup(props, { emit }) {
    const data: Data[] = [
      {
        x: props.x as number[],
        y: props.y as number[],
        type: "scatter",
        line: {
          color: tailwindColours.indigo[500],
          width: 2,
        },
        hoverinfo: props.hoverinfo as PlotData["hoverinfo"],
        hovertemplate: props.hovertemplate,
      },
    ];

    const layout = {
      autosize: true,
      margin: { l: props.yLabel ? 60 : 40, t: 10, r: 10, b: props.xLabel ? 30 : 20 },
      xaxis: {
        title: props.xLabel,
        fixedrange: props.fixedrange,
        titlefont: {
          size: 12,
          color: tailwindColours.gray[600],
        },
      },
      yaxis: {
        title: props.yLabel,
        fixedrange: props.fixedrange,
        titlefont: {
          size: 12,
          color: tailwindColours.gray[600],
        },
      },
    };

    const config = {
      responsive: true,
    };

    onMounted(async () => {
      const plot = await newPlot(props.id, data, layout, config);

      plot.on("plotly_click", function (data) {
        emit("click", data.points[data.points.length - 1]);
      });
    });
  },
});
</script>
