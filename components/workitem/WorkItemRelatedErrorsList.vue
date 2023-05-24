<template>
  <!-- Related errors card -->
  <BaseCard v-if="relatedErrors && relatedErrors.length > 0">
    <BaseCardHeader>
      <h2>Related Errors</h2>
    </BaseCardHeader>
    <ul class="divide-y divide-gray-300">
      <div v-for="item in relatedErrors" :key="item.id" :item="item" class="hover:bg-gray-50">
        <NuxtLink :to="`/messages/${item.id}`">
          <MessagesListItem :item="item" />
        </NuxtLink>
      </div>
    </ul>
    <BasePaginator
      class="border-t border-gray-200 bg-white"
      :jump-to-top="false"
      :page="relatedErrorsPage"
      :size="relatedErrorsSize"
      :total="relatedErrorsTotal"
      @next="relatedErrorsPage++"
      @prev="relatedErrorsPage--"
      @jump="relatedErrorsPage = $event"
    />
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { MessageSchema, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import MessagesListItem from "~/components/messages/MessagesListItem.vue";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardHeader,
    BasePaginator,
    MessagesListItem,
  },
  props: {
    workitem: {
      type: Object as () => WorkItemSchema,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  setup(props) {
    const { workItemsApi } = useApi();

    // Related errors data
    const relatedErrors = ref([] as MessageSchema[]);
    const relatedErrorsPage = ref(1);
    const relatedErrorsSize = ref(props.size);
    const relatedErrorsTotal = ref(0);

    function updateRelatedErrors() {
      workItemsApi
        .getWorkitemMessages({
          workitemId: props.workitem.id,
          page: relatedErrorsPage.value || 1,
          size: relatedErrorsSize.value,
          status: ["ERROR"],
        })
        .then((response) => {
          relatedErrors.value = response.data.items;
          relatedErrorsPage.value = response.data.page ?? 0;
          relatedErrorsSize.value = response.data.size ?? 0;
          relatedErrorsTotal.value = response.data.total;
        });
    }

    onMounted(updateRelatedErrors);

    watch(relatedErrorsPage, () => {
      updateRelatedErrors();
    });

    return {
      relatedErrors,
      relatedErrorsPage,
      relatedErrorsSize,
      relatedErrorsTotal,
    };
  },
});
</script>

<style scoped></style>
