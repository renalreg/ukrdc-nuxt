<template>
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@nuxtjs/composition-api";
import { Link } from "@ukkidney/ukrdc-axios-ts";
import { Data, newPlot } from "plotly.js";

import { plotColours } from "~/helpers/colourUtils";

export default defineComponent({
  props: {
    link: {
      type: Object as () => Link,
      default: null,
    },
    label: {
      type: Array,
      default: null,
    },
    colors: {
      type: Array,
      default: () => {
        return plotColours;
      },
    },
    id: {
      type: String,
      default: "doughnut",
    },
  },

  setup(props) {
    // NOTE:  We need to coerce `data` here into Data type because the
    //        Plotly type definitions don't seem to know about Sankey plots
    const data: Data[] = [
      {
        type: "sankey",
        orientation: "h",
        node: {
          pad: 15,
          thickness: 30,
          line: {
            color: "black",
            width: 0.5,
          },
          color: props.colors as string[],
          label: props.label,
        },

        link: props.link,
      } as Data,
    ];

    const layout = {
      autosize: true,
      margin: { l: 20, t: 20, r: 20, b: 20 },
    };

    const config = { responsive: true };

    onMounted(() => {
      newPlot(props.id, data, layout, config);
    });
  },
});
</script>
