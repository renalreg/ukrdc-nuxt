<template>
  <GenericCard>
    <GenericCardHeader><TextH2>Details</TextH2></GenericCardHeader>
    <GenericCardContent>
      <GenericDl :cols="2">
        <GenericDi>
          <TextDt>Last Updated</TextDt>
          <TextDd v-if="item">
            {{ item.lastUpdated ? formatDate(item.lastUpdated) : "Never" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDi>
        <GenericDi>
          <TextDt>Last Updated By</TextDt>
          <TextDd v-if="item">
            {{ item.updatedBy ? item.updatedBy : "N/A" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDi>
        <GenericDi class="sm:col-span-2">
          <TextDt>Comments</TextDt>
          <TextDd v-if="item">
            {{ item.updateDescription ? item.updateDescription : "None" }}
          </TextDd>
          <SkeleText v-else class="h-6 w-full" />
        </GenericDi>
      </GenericDl>
    </GenericCardContent>
  </GenericCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { formatDate } from "@/helpers/utils/dateUtils";

import { WorkItemExtended } from "@/interfaces/workitem";

export default defineComponent({
  props: {
    item: {
      type: Object as () => WorkItemExtended,
      required: false,
      default: undefined,
    },
  },
  setup() {
    return { formatDate };
  },
});
</script>
