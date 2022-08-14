<template>
  <div>
    <LoadingContainer :loading="!documents">
      <TextP v-if="documents && documents.length <= 0" class="text-center">No documents on record</TextP>
      <GenericCard v-else>
        <ul class="divide-y divide-gray-200">
          <div v-for="item in documents" :key="item.id" :item="item" class="hover:bg-gray-50">
            <NuxtLink :to="`/patientrecords/${$route.params.pid}/documents/${item.id}`">
              <PatientrecordsDocumentListItem :item="item" />
            </NuxtLink>
          </div>
        </ul>
        <GenericPaginator
          v-if="documents && documents.length > 0"
          class="border-t border-gray-200 bg-white"
          :page="page"
          :size="size"
          :total="total"
          @next="page++"
          @prev="page--"
          @jump="page = $event"
        />
      </GenericCard>
    </LoadingContainer>
  </div>
</template>

<script lang="ts">
import { DocumentSummarySchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";
import usePagination from "~/helpers/query/usePagination";
import useDateRange from "~/helpers/query/useDateRange";
import useApi from "~/helpers/useApi";

export default defineComponent({
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
          page.value = response.data.page;
          size.value = response.data.size;
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
