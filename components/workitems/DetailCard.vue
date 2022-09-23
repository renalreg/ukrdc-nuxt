<template>
  <BaseCard>
    <BaseCardHeader><h2>Details</h2></BaseCardHeader>
    <BaseCardContent>
      <BaseDlGrid :cols="2">
        <BaseDlGridItem>
          <dt>Last Updated</dt>
          <dd v-if="item">
            {{ item.lastUpdated ? formatDate(item.lastUpdated) : "Never" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDlGridItem>
        <BaseDlGridItem>
          <dt>Last Updated By</dt>
          <dd v-if="item">
            {{ item.updatedBy ? item.updatedBy : "N/A" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDlGridItem>
        <BaseDlGridItem class="sm:col-span-2">
          <dt>Comments</dt>
          <dd v-if="item">
            {{ item.updateDescription ? item.updateDescription : "None" }}
          </dd>
          <BaseSkeleText v-else class="h-6 w-full" />
        </BaseDlGridItem>
      </BaseDlGrid>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { WorkItemExtendedSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseDlGrid from "~/components/base/BaseDlGrid.vue";
import BaseDlGridItem from "~/components/base/BaseDlGridItem.vue";

import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
    BaseSkeleText,
    BaseDlGrid,
    BaseDlGridItem,
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
