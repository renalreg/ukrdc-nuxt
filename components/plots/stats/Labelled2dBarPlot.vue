<!-- eslint-disable vue/no-v-html -->
<template>
  <BaseCard class="mb-4">
    <BaseCardHeader class="flex items-center gap-2">
      <BaseMarkdownDescriptionTooltip v-if="labelled2d" :description-markdown="labelled2d.metadata.description" />
      <div class="flex-1">
        <div class="flex gap-2">
          <h2>{{ labelled2d ? labelled2d.metadata.title : "" }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <h6>{{ labelled2d ? labelled2d.metadata.summary : "" }}</h6>
        </div>
      </div>
      <BaseButtonMini v-if="labelled2d" @click="exportData">Export</BaseButtonMini>
    </BaseCardHeader>
    <BaseBarPlot
      v-if="labelled2d"
      :id="id"
      :x="labelled2d.data.x"
      :y="labelled2d.data.y"
      :x-label="labelled2d.metadata.axisTitles?.x"
      :y-label="labelled2d.metadata.axisTitles?.y"
      :x-type="xType"
      :y-type="yType"
      :hoverinfo="hoverinfo"
      :hovertemplate="hovertemplate"
      :fixedrange="fixedrange"
      :orientation="orientation"
      class="m-2 h-72"
    />
    <SkelePlot v-else />
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { Labelled2d } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseBarPlot from "~/components/plots/base/BaseBarPlot.vue";
import BaseMarkdownDescriptionTooltip from "~/components/plots/stats/BaseMarkdownDescriptionTooltip.vue";
import SkelePlot from "~/components/plots/stats/SkelePlot.vue";
import { buildCsv } from "~/helpers/exportUtils";
import { saveAs } from "~/helpers/fileUtils";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseBarPlot,
    BaseCard,
    BaseCardHeader,
    SkelePlot,
    BaseMarkdownDescriptionTooltip,
  },
  props: {
    labelled2d: {
      type: Object as () => Labelled2d,
      required: false,
      default: undefined,
    },
    xType: {
      // See https://plotly.com/javascript/reference/layout/xaxis/#layout-xaxis-type
      type: String,
      default: "-",
    },
    yType: {
      // See https://plotly.com/javascript/reference/layout/yaxis/#layout-yaxis-type
      type: String,
      default: "-",
    },
    hoverinfo: {
      type: String,
      required: false,
      default: undefined,
    },
    hovertemplate: {
      type: String,
      required: false,
      default: undefined,
    },
    exportFileName: {
      type: String,
      required: false,
      default: "labelled2d-export",
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
    function exportData() {
      const rows: (string | number)[][] = [
        [props.labelled2d.metadata.axisTitles?.x || "x", props.labelled2d.metadata.axisTitles?.y || "y"],
      ];
      for (let i = 0; i < props.labelled2d.data.x.length; i++) {
        rows.push([props.labelled2d.data.x[i], props.labelled2d.data.y[i] as number]);
      }

      const blob = new Blob([buildCsv(rows)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${props.exportFileName}.csv`);
    }

    return {
      exportData,
    };
  },
});
</script>
