<template>
  <div>
    <BaseCard>
      <BaseCardHeader>
        <div class="mb-1">
          <h2 v-if="patientDocument">{{ patientDocument.documentname || "Unnamed Document" }}</h2>
          <SkeleText v-else class="h-6 w-1/2" />
        </div>
        <div>
          <h5 v-if="patientDocument">
            {{ patientDocument.documenttime ? formatDate(patientDocument.documenttime) : "Unknown date" }}
          </h5>
          <SkeleText v-else class="h-6 w-1/3" />
        </div>
      </BaseCardHeader>
      <BaseCardContent>
        <GenericDlGrid>
          <GenericDlGridItem>
            <dt>Entered At</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.enteredatdesc || patientDocument.enteredatcode || "Unknown Facility" }}
            </dd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <dt>Entered By</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.enteredbydesc || patientDocument.enteredbycode || "Unknown Person" }}
            </dd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <dt>Clinician:</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.cliniciandesc || patientDocument.cliniciancode || "Unknown Clinician" }}
            </dd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <dt>Document Date</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.documenttime ? formatDate(patientDocument.documenttime) : "Unknown date" }}
            </dd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <dt>Creation Date</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.creationDate ? formatDate(patientDocument.creationDate) : "Unknown date" }}
            </dd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <dt>Update Date</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.updateDate ? formatDate(patientDocument.updateDate) : "Unknown date" }}
            </dd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDlGridItem>
          <GenericDlGridItem v-if="patientDocument && patientDocument.notetext" class="sm:col-span-3">
            <dt>Note</dt>
            <dd class="whitespace-pre-wrap font-mono">{{ patientDocument.notetext }}</dd>
          </GenericDlGridItem>
          <div v-if="patientDocument" class="sm:col-span-2">
            <dt>Attachments</dt>
            <dd>
              <BaseCard>
                <GenericAttachment :filename="filename">
                  <TextLink @click="downloadPatientRecordDocument()"> Download </TextLink>
                </GenericAttachment>
              </BaseCard>
            </dd>
          </div>
        </GenericDlGrid>
      </BaseCardContent>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRoute } from "@nuxtjs/composition-api";
import { DocumentSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import { formatDate } from "~/helpers/dateUtils";

import useApi from "~/composables/useApi";
import { saveAs } from "~/helpers/fileUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseCardContent,
    BaseCardHeader,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute();
    const { patientRecordsApi } = useApi();

    // Data refs
    const patientDocument = ref<DocumentSchema>();

    // Computed properties
    const filename = computed(() => {
      if (!patientDocument.value) {
        return undefined;
      }
      return patientDocument.value.filename || `${patientDocument.value.documentname}.txt`;
    });

    // Data fetching
    onMounted(() => {
      patientRecordsApi
        .getPatientDocument({
          pid: props.record.pid,
          documentId: route.value.params.docid,
        })
        .then((response) => {
          patientDocument.value = response.data;
        });
    });

    const documentDownloadInProgress = ref(false);

    function downloadPatientRecordDocument() {
      documentDownloadInProgress.value = true;
      patientRecordsApi
        .getPatientDocumentDownload(
          {
            pid: props.record.pid,
            documentId: route.value.params.docid,
          },
          {
            method: "GET",
            responseType: "blob",
          }
        )
        .then((response) => {
          const blob = new Blob([response.data]);
          saveAs(blob, patientDocument.value?.filename || `${patientDocument.value?.documentname}.txt`);
        });
    }

    return {
      patientDocument,
      filename,
      formatDate,
      downloadPatientRecordDocument,
      documentDownloadInProgress,
    };
  },
});
</script>
