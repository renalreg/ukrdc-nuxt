<template>
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@nuxtjs/composition-api";
import { Data, newPlot } from "plotly.js";
import { plotColours } from "~/helpers/utils/colourUtils";

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
        return plotColours;
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
    const data: Data[] = [
      {
        values: props.data as number[],
        labels: props.labels as string[],
        type: "pie",
      },
    ];

    const layout = {
      font: { size: 18 },
    };

    const config = { responsive: true };

    onMounted(() => {
      newPlot(props.id, data, layout, config);
    });
  },
});
</script>
