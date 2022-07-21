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
import fetchPatientRecords from "~/helpers/fetch/fetchPatientRecords";
import { formatDate } from "@/helpers/utils/dateUtils";

import { PatientRecord } from "@/interfaces/patientrecord";
import { PatientDocument } from "~/interfaces/document";

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { fetchPatientRecordDocument, downloadPatientRecordDocument, documentDownloadInProgress } =
      fetchPatientRecords();
    const route = useRoute();

    // Data refs
    const patientDocument = ref<PatientDocument>();

    // Computed properties
    const filename = computed(() => {
      if (!patientDocument.value) {
        return undefined;
      }
      return patientDocument.value.filename || `${patientDocument.value.documentname}.txt`;
    });

    // Data fetching
    onMounted(async () => {
      patientDocument.value = await fetchPatientRecordDocument(props.record, route.params.docid);
    });

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
