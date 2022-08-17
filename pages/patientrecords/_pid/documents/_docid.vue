<template>
  <div>
    <LoadingIndicatorFull :visible="documentDownloadInProgress" />

    <GenericCard>
      <GenericCardHeader>
        <div class="mb-1">
          <TextH2 v-if="patientDocument"> {{ patientDocument.documentname || "Unnamed Document" }} </TextH2>
          <SkeleText v-else class="h-6 w-1/2" />
        </div>
        <div>
          <TextL1 v-if="patientDocument">{{ formatDate(patientDocument.documenttime) }}</TextL1>
          <SkeleText v-else class="h-6 w-1/3" />
        </div>
      </GenericCardHeader>
      <GenericCardContent>
        <GenericDlGrid>
          <GenericDlGridItem>
            <TextDt>Entered At</TextDt>
            <TextDd v-if="patientDocument">
              {{ patientDocument.enteredatdesc || patientDocument.enteredatcode || "Unknown Facility" }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Entered By</TextDt>
            <TextDd v-if="patientDocument">{{
              patientDocument.enteredbydesc || patientDocument.enteredbycode || "Unknown Person"
            }}</TextDd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Clinician:</TextDt>
            <TextDd v-if="patientDocument">
              {{ patientDocument.cliniciandesc || patientDocument.cliniciancode || "Unknown Clinician" }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Document Date</TextDt>
            <TextDd v-if="patientDocument">
              {{ formatDate(patientDocument.documenttime) }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Creation Date</TextDt>
            <TextDd v-if="patientDocument">
              {{ formatDate(patientDocument.creationDate) }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDlGridItem>
          <GenericDlGridItem>
            <TextDt>Update Date</TextDt>
            <TextDd v-if="patientDocument">
              {{ formatDate(patientDocument.updateDate) }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDlGridItem>
          <GenericDlGridItem v-if="patientDocument && patientDocument.notetext" class="sm:col-span-3">
            <TextDt>Note</TextDt>
            <TextDd class="whitespace-pre-wrap font-mono">{{ patientDocument.notetext }}</TextDd>
          </GenericDlGridItem>
          <div v-if="patientDocument" class="sm:col-span-2">
            <TextDt>Attachments</TextDt>
            <TextDd>
              <GenericCardMini>
                <GenericAttachment :filename="filename">
                  <TextLink @click="downloadPatientRecordDocument(patientDocument)"> Download </TextLink>
                </GenericAttachment>
              </GenericCardMini>
            </TextDd>
          </div>
        </GenericDlGrid>
      </GenericCardContent>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRoute } from "@nuxtjs/composition-api";

import { DocumentSchema, PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";

import useApi from "~/helpers/useApi";

export default defineComponent({
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
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            patientDocument.value?.filename || `${patientDocument.value?.documentname}.txt`
          );
          document.body.appendChild(link);
          link.click();
          documentDownloadInProgress.value = false;
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
