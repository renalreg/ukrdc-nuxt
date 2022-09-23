<template>
  <div>
    <BaseCard>
      <BaseCardHeader>
        <div class="mb-1">
          <h2 v-if="patientDocument">{{ patientDocument.documentname || "Unnamed Document" }}</h2>
          <BaseSkeleText v-else class="h-6 w-1/2" />
        </div>
        <div>
          <h5 v-if="patientDocument">
            {{ patientDocument.documenttime ? formatDate(patientDocument.documenttime) : "Unknown date" }}
          </h5>
          <BaseSkeleText v-else class="h-6 w-1/3" />
        </div>
      </BaseCardHeader>
      <BaseCardContent>
        <BaseDescriptionListGrid>
          <BaseDescriptionListGridItem>
            <dt>Entered At</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.enteredatdesc || patientDocument.enteredatcode || "Unknown Facility" }}
            </dd>
            <BaseSkeleText v-else class="h-6 w-1/2" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Entered By</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.enteredbydesc || patientDocument.enteredbycode || "Unknown Person" }}
            </dd>
            <BaseSkeleText v-else class="h-6 w-1/2" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Clinician:</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.cliniciandesc || patientDocument.cliniciancode || "Unknown Clinician" }}
            </dd>
            <BaseSkeleText v-else class="h-6 w-1/2" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Document Date</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.documenttime ? formatDate(patientDocument.documenttime) : "Unknown date" }}
            </dd>
            <BaseSkeleText v-else class="h-6 w-1/3" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Creation Date</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.creationDate ? formatDate(patientDocument.creationDate) : "Unknown date" }}
            </dd>
            <BaseSkeleText v-else class="h-6 w-1/3" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem>
            <dt>Update Date</dt>
            <dd v-if="patientDocument">
              {{ patientDocument.updateDate ? formatDate(patientDocument.updateDate) : "Unknown date" }}
            </dd>
            <BaseSkeleText v-else class="h-6 w-1/3" />
          </BaseDescriptionListGridItem>
          <BaseDescriptionListGridItem v-if="patientDocument && patientDocument.notetext" class="sm:col-span-3">
            <dt>Note</dt>
            <dd class="whitespace-pre-wrap font-mono">{{ patientDocument.notetext }}</dd>
          </BaseDescriptionListGridItem>
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
        </BaseDescriptionListGrid>
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
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";

import { formatDate } from "~/helpers/dateUtils";
import useApi from "~/composables/useApi";
import { saveAs } from "~/helpers/fileUtils";

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
