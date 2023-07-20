<template>
  <div class="sensitive">
    <BaseLoadingContainer :loading="!documents">
      <p v-if="documents && documents.length <= 0" class="text-center">No documents on record</p>
      <BaseCard v-else>
        <ul class="divide-y divide-gray-300">
          <li v-for="item in documents" :key="item.id" :item="item" class="hover:bg-gray-50">
            <NuxtLink :to="`/patientrecords/${$route.params.pid}/medical/documents/${item.id}`">
              <PatientRecordDocumentListItem :item="item" />
            </NuxtLink>
          </li>
        </ul>
        <BasePaginator
          v-if="documents && documents.length > 0"
          class="border-t border-gray-200 bg-white"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </BaseCard>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { DocumentSummarySchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BasePaginator from "~/components/base/BasePaginator.vue";
import PatientRecordDocumentListItem from "~/components/patientrecord/medical/PatientRecordDocumentListItem.vue";
import useDateRange from "~/composables/query/useDateRange";
import usePagination from "~/composables/query/usePagination";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseLoadingContainer,
    BasePaginator,
    PatientRecordDocumentListItem,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup(props) {
    const { page, total, size } = usePagination();
    const { makeDateRange } = useDateRange();
    const { patientRecordsApi } = useApi();

    // Set initial date dateRange
    const dateRange = makeDateRange(null, null, true, false);

    // Data refs

    const documents = ref<DocumentSummarySchema[]>();

    // Data fetching

    function getDocuments() {
      patientRecordsApi
        .getPatientDocuments({
          pid: props.record.pid,
          page: page.value || 1,
          size: size.value,
        })
        .then((response) => {
          documents.value = response.data.items;
          total.value = response.data.total;
          page.value = response.data.page ?? 0;
          size.value = response.data.size ?? 0;
        });
    }

    onMounted(() => {
      getDocuments();
    });

    watch(page, () => {
      getDocuments();
    });

    return {
      page,
      size,
      total,
      dateRange,
      documents,
      formatDate,
    };
  },
});
</script>

<style scoped></style>
