<template>
  <BaseCard>
    <BaseCardHeader><h2>Details</h2></BaseCardHeader>
    <BaseCardContent>
      <GenericDlGrid :cols="2">
        <GenericDlGridItem>
          <TextDt>Last Updated</TextDt>
          <TextDd v-if="item">
            {{ item.lastUpdated ? formatDate(item.lastUpdated) : "Never" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDlGridItem>
        <GenericDlGridItem>
          <TextDt>Last Updated By</TextDt>
          <TextDd v-if="item">
            {{ item.updatedBy ? item.updatedBy : "N/A" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDlGridItem>
        <GenericDlGridItem class="sm:col-span-2">
          <TextDt>Comments</TextDt>
          <TextDd v-if="item">
            {{ item.updateDescription ? item.updateDescription : "None" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDlGridItem>
      </GenericDlGrid>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { WorkItemExtendedSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";

import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
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
