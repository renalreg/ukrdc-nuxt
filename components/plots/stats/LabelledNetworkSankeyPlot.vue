<!-- eslint-disable vue/no-v-html -->
<template>
  <BaseCard class="mb-4">
    <BaseCardHeader class="flex items-center gap-2">
      <BaseMarkdownDescriptionTooltip
        v-if="labelledNetwork"
        :description-markdown="labelledNetwork.metadata.description"
      />
      <div class="flex-1">
        <div class="flex gap-2">
          <h2>{{ labelledNetwork ? labelledNetwork.metadata.title : "" }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <h6>{{ labelledNetwork ? labelledNetwork.metadata.summary : "" }}</h6>
        </div>
      </div>
      <BaseButtonMini v-if="labelledNetwork" @click="exportData">Export</BaseButtonMini>
    </BaseCardHeader>
    <BaseSankeyPlot
      v-if="labelledNetwork"
      :id="id"
      :label="labelledNetwork.node.nodeLabels"
      :link="labelledNetwork.link"
      class="h-72"
    />
    <BaseSkeleImage v-else class="h-72 w-full" />
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { LabelledNetwork } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleImage from "~/components/base/BaseSkeleImage.vue";
import BaseSankeyPlot from "~/components/plots/base/BaseSankeyPlot.vue";
import BaseMarkdownDescriptionTooltip from "~/components/plots/stats/BaseMarkdownDescriptionTooltip.vue";
import { saveAs } from "~/helpers/fileUtils";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseSankeyPlot,
    BaseCard,
    BaseCardHeader,
    BaseSkeleImage,
    BaseMarkdownDescriptionTooltip,
  },
  props: {
    labelledNetwork: {
      type: Object as () => LabelledNetwork,
      required: false,
      default: undefined,
    },
    exportFileName: {
      type: String,
      required: false,
      default: "labelledNetwork-export",
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

  setup(props) {
    function exportData() {
      const exportJSON = {
        node: props.labelledNetwork.node.nodeLabels,
        link: props.labelledNetwork.link,
      };

      const blob = new Blob([JSON.stringify(exportJSON)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${props.exportFileName}.json`);
    }

    return {
      exportData,
    };
  },
});
</script>
