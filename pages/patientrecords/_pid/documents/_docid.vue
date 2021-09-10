<template>
  <div>
    <GenericCard>
      <GenericCardHeader>
        <div class="mb-1">
          <TextH2 v-if="patientDocument"> {{ patientDocument.documentname || 'Unnamed Document' }} </TextH2>
          <SkeleText v-else class="h-6 w-1/2" />
        </div>
        <div>
          <TextL1 v-if="patientDocument">{{ formatDate(patientDocument.documenttime) }}</TextL1>
          <SkeleText v-else class="h-6 w-1/3" />
        </div>
      </GenericCardHeader>
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Entered At</TextDt>
            <TextDd v-if="patientDocument">
              {{ patientDocument.enteredatdesc || patientDocument.enteredatcode || 'Unknown Facility' }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDi>
          <GenericDi>
            <TextDt>Entered By</TextDt>
            <TextDd v-if="patientDocument">{{
              patientDocument.enteredbydesc || patientDocument.enteredbycode || 'Unknown Person'
            }}</TextDd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDi>
          <GenericDi>
            <TextDt>Clinician:</TextDt>
            <TextDd v-if="patientDocument">
              {{ patientDocument.cliniciandesc || patientDocument.cliniciancode || 'Unknown Clinician' }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/2" />
          </GenericDi>
          <GenericDi>
            <TextDt>Document Date</TextDt>
            <TextDd v-if="patientDocument">
              {{ formatDate(patientDocument.documenttime) }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDi>
          <GenericDi>
            <TextDt>Creation Date</TextDt>
            <TextDd v-if="patientDocument">
              {{ formatDate(patientDocument.creationDate) }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDi>
          <GenericDi>
            <TextDt>Update Date</TextDt>
            <TextDd v-if="patientDocument">
              {{ formatDate(patientDocument.updateDate) }}
            </TextDd>
            <SkeleText v-else class="h-6 w-1/3" />
          </GenericDi>
          <GenericDi v-if="patientDocument && patientDocument.notetext" class="sm:col-span-3">
            <TextDt>Note</TextDt>
            <TextDd class="whitespace-pre font-mono">
              {{ patientDocument.notetext }}
            </TextDd>
          </GenericDi>
          <div v-if="patientDocument" class="sm:col-span-2">
            <TextDt>Attachments</TextDt>
            <TextDd>
              <GenericCardMini>
                <ul role="list">
                  <li class="pl-3 pr-4 py-3 flex items-center justify-between">
                    <div class="w-0 flex-1 flex items-center">
                      <IconMiniPaperClip class="mr-2" />
                      <TextP class="flex-1 w-0 truncate"> {{ filename }} </TextP>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <LoadingIndicator v-if="documentDownloadInProgress" class="h-4"></LoadingIndicator>
                      <TextLink v-else @click="downloadPatientRecordDocument(patientDocument)"> Download </TextLink>
                    </div>
                  </li>
                </ul>
              </GenericCardMini>
            </TextDd>
          </div>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useRoute } from '@nuxtjs/composition-api'

import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'
import { formatDate } from '@/helpers/utils/dateUtils'

import { PatientRecord } from '@/interfaces/patientrecord'
import { PatientDocument } from '~/interfaces/document'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props) {
    const { fetchPatientRecordDocument, downloadPatientRecordDocument, documentDownloadInProgress } =
      fetchPatientRecords()
    const route = useRoute()

    // Data refs
    const patientDocument = ref<PatientDocument>()

    // Computed properties
    const filename = computed(() => {
      if (!patientDocument.value) {
        return undefined
      }
      return patientDocument.value.filename || `${patientDocument.value.documentname}.txt`
    })

    // Data fetching
    onMounted(async () => {
      patientDocument.value = await fetchPatientRecordDocument(props.record, route.value.params.docid)
    })

    return {
      patientDocument,
      filename,
      formatDate,
      downloadPatientRecordDocument,
      documentDownloadInProgress,
    }
  },
})
</script>
