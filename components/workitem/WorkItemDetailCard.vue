<template>
  <BaseCard>
    <BaseCardHeader><h2>Details</h2></BaseCardHeader>
    <BaseCardContent>
      <BaseDescriptionListGrid :cols="2">
        <BaseDescriptionListGridItem>
          <dt>Last Updated</dt>
          <dd v-if="item">
            {{ item.lastUpdated ? formatDate(item.lastUpdated) : "Never" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Last Updated By</dt>
          <dd v-if="item">
            {{ item.updatedBy ? item.updatedBy : "N/A" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem class="sm:col-span-2">
          <dt>Comments</dt>
          <dd v-if="item">
            {{ item.updateDescription ? item.updateDescription : "None" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDescriptionListGridItem>
      </BaseDescriptionListGrid>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { WorkItemExtendedSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
    BaseSkeleText,
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
  },
  props: {
    item: {
      type: Object as () => WorkItemExtendedSchema,
      required: false,
      default: undefined,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>
