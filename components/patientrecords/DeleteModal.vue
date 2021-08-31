<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen w-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay, show/hide based on modal state. -->
        <GenericBlackout :visible="visible" @click="hide()" />

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal panel, show/hide based on modal state. -->
        <TransitionModal>
          <div
            v-show="visible"
            class="
              inline-block
              align-bottom
              bg-white
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              w-full
              sm:w-3/4 sm:max-w-3xl sm:my-8 sm:align-middle sm:p-6
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="sm:flex sm:items-start">
              <div
                class="
                  bg-red-100
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  sm:mx-0 sm:h-10 sm:w-10
                "
              >
                <!-- Heroicon name: outline/exclamation -->
                <svg
                  class="text-red-600 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 sm:mt-0 ml-8 sm:ml-4 text-left">
                <h3 id="modal-headline" class="text-lg leading-6 font-medium text-gray-900">
                  {{ previewErrorMessage ? 'Unable to delete patient record' : 'Delete patient record' }}
                </h3>
                <div class="mt-2 mb-4">
                  <div v-if="previewErrorMessage">
                    <TextP>{{ previewErrorMessage }}</TextP>
                  </div>
                  <div v-if="previewResponse && !deleteInProgress">
                    <TextH3 class="mb-2">The following data will be permanantly deleted</TextH3>
                    <ul class="list-disc">
                      <li>
                        Patient record {{ previewResponse.patientRecord.pid }} - UKRDCID
                        {{ previewResponse.patientRecord.ukrdcid }} - Created
                        {{ formatDate(previewResponse.patientRecord.repositoryCreationDate, (t = false)) }}
                        <ul class="list-disc ml-4">
                          <li v-if="previewResponse.patientRecord.programMemberships.length > 0">
                            {{ previewResponse.patientRecord.programMemberships.length }} program memberships
                            <ul class="list-disc ml-4">
                              <li
                                v-for="membership in previewResponse.patientRecord.programMemberships"
                                :key="membership.programName"
                              >
                                {{ membership.programName }} since {{ formatDate(membership.fromTime, (t = false)) }}
                              </li>
                            </ul>
                          </li>
                          <li v-if="previewResponse.patientRecord.socialHistories.length > 0">
                            {{ previewResponse.patientRecord.socialHistories.length }} social histories
                          </li>
                          <li v-if="previewResponse.patientRecord.familyHistories.length > 0">
                            {{ previewResponse.patientRecord.familyHistories.length }} family histories
                          </li>
                          <li v-if="previewResponse.patientRecord.observations.length > 0">
                            {{ previewResponse.patientRecord.observations.length }} observations
                          </li>
                          <li v-if="previewResponse.patientRecord.allergies.length > 0">
                            {{ previewResponse.patientRecord.allergies.length }} allergies
                          </li>
                          <li v-if="previewResponse.patientRecord.diagnoses.length > 0">
                            {{ previewResponse.patientRecord.diagnoses.length }} diagnoses
                          </li>
                          <li v-if="previewResponse.patientRecord.renaldiagnoses.length > 0">
                            {{ previewResponse.patientRecord.renaldiagnoses.length }} renal diagnoses
                          </li>
                          <li v-if="previewResponse.patientRecord.medications.length > 0">
                            {{ previewResponse.patientRecord.medications.length }} medications
                          </li>
                          <li v-if="previewResponse.patientRecord.procedures.length > 0">
                            {{ previewResponse.patientRecord.procedures.length }} procedures
                          </li>
                          <li v-if="previewResponse.patientRecord.documents.length > 0">
                            {{ previewResponse.patientRecord.documents.length }} documents
                          </li>
                          <li v-if="previewResponse.patientRecord.encounters.length > 0">
                            {{ previewResponse.patientRecord.encounters.length }} encounters
                          </li>
                          <li v-if="previewResponse.patientRecord.clinicalRelationships.length > 0">
                            {{ previewResponse.patientRecord.clinicalRelationships.length }} clinical relationships
                          </li>
                          <li v-if="previewResponse.patientRecord.surveys.length > 0">
                            {{ previewResponse.patientRecord.surveys.length }} surveys
                          </li>
                          <li v-if="previewResponse.patientRecord.patient">
                            Patient - Date of Birth
                            {{ formatDate(previewResponse.patientRecord.patient.birthTime, (t = false)) }}
                            <ul class="list-disc ml-4">
                              <li
                                v-for="name in previewResponse.patientRecord.patient.names"
                                :key="name.given + name.family"
                              >
                                Patient Name {{ name.given }} {{ name.family }}
                              </li>
                            </ul>
                            <ul class="list-disc ml-4">
                              <li
                                v-for="number in previewResponse.patientRecord.patient.numbers"
                                :key="number.organization + number.numbertype + number.patientid"
                              >
                                Patient Number {{ number.organization }}:{{ number.numbertype }}:{{ number.patientid }}
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li v-if="previewResponse.empi.masterRecords.length > 0">
                        {{ previewResponse.empi.masterRecords.length }} Master Records
                        <ul class="list-disc ml-4">
                          <li v-for="masterRecord in previewResponse.empi.masterRecords" :key="masterRecord.id">
                            Master Record {{ masterRecord.id }} - {{ masterRecord.givenname }}
                            {{ masterRecord.surname }} - Date of Birth
                            {{ formatDate(masterRecord.dateOfBirth, (t = false)) }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.persons.length > 0">
                        {{ previewResponse.empi.persons.length }} Person Records
                        <ul class="list-disc ml-4">
                          <li v-for="person in previewResponse.empi.persons" :key="person.id">
                            Person {{ person.id }} - {{ person.givenname }} {{ person.surname }} - Date of Birth
                            {{ formatDate(person.dateOfBirth, (t = false)) }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.linkRecords.length > 0">
                        {{ previewResponse.empi.linkRecords.length }} Link Records
                        <ul class="list-disc ml-4">
                          <li v-for="linkRecord in previewResponse.empi.linkRecords" :key="linkRecord.id">
                            Link Record {{ linkRecord.id }} - Person {{ linkRecord.personId }} linked to Master Record
                            {{ linkRecord.masterId }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.pidxrefs.length > 0">
                        {{ previewResponse.empi.pidxrefs.length }} PID Cross References
                        <ul class="list-disc ml-4">
                          <li v-for="pidXRef in previewResponse.empi.pidxrefs" :key="pidXRef.id">
                            PIDXRef {{ pidXRef.id }} - {{ pidXRef.sendingFacility }} via {{ pidXRef.sendingExtract }}:
                            {{ pidXRef.localid }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.workItems.length > 0">
                        {{ previewResponse.empi.workItems.length }} Work Items
                      </li>
                    </ul>
                  </div>
                </div>
                <FormCheckbox
                  v-if="(previewResponse && !previewErrorMessage) || deleteInProgress"
                  v-model="confirmChecked"
                  :disabled="!previewResponse"
                  label="Yes, delete this record and all associated data"
                />
              </div>
            </div>
            <div v-if="(!previewErrorMessage && !previewResponse) || deleteInProgress" class="w-full">
              <LoadingIndicator></LoadingIndicator>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <GenericButton
                v-if="previewResponse && !previewErrorMessage"
                class="ml-2"
                colour="red"
                :primary="true"
                :disabled="!confirmChecked || deleteInProgress"
                @click="doRealDelete()"
              >
                Delete
              </GenericButton>
              <GenericButton @click="cancel()"> Cancel </GenericButton>
            </div>
          </div>
        </TransitionModal>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api'
import useModal from '@/mixins/useModal'
import { formatDate } from '@/utilities/dateUtils'
import { PatientRecord, PatientRecordFull } from '~/interfaces/patientrecord'
import { MasterRecord } from '~/interfaces/masterrecord'
import { Person, PidXRef } from '~/interfaces/persons'
import { WorkItem } from '~/interfaces/workitem'
import { LinkRecordSummary } from '~/interfaces/linkrecords'

interface DeletePIDFromEMPISchema {
  persons: Person[]
  masterRecords: MasterRecord[]
  pidxrefs: PidXRef[]
  workItems: WorkItem[]
  linkRecords: LinkRecordSummary[]
}

interface DeletePIDResponseSchema {
  hash: string
  committed: boolean

  patientRecord: PatientRecordFull
  empi: DeletePIDFromEMPISchema
}

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { $axios, $config, $toast } = useContext()
    const { visible, show, hide, toggle } = useModal()

    const confirmChecked = ref(false)
    const previewResponse = ref<DeletePIDResponseSchema>()
    const deleteResponse = ref<DeletePIDResponseSchema>()
    const previewErrorMessage = ref<string>()
    const deleteInProgress = ref(false)

    function cancel(): void {
      emit('cancel')
      hide()
    }

    watch(visible, async () => {
      // If the modal becomes visible
      if (visible.value) {
        // Reset the modal each time it's is shown.
        confirmChecked.value = false
        previewResponse.value = undefined
        deleteResponse.value = undefined

        try {
          // Fetch the delete preview and confirmation hash
          const res: DeletePIDResponseSchema = await $axios.$post(
            `${$config.apiBase}/v1/patientrecords/${props.item.pid}/delete`
          )
          previewResponse.value = res
        } catch (error) {
          // Populate error message if preview fails
          if (error.response.status === 400) {
            console.log(error.response.data.detail)
            previewErrorMessage.value = error.response.data.detail
          }
        }
      }
    })

    async function doRealDelete() {
      // Emit confirm event (currently unused)
      emit('confirm')
      // If the checkbox is checked and we have a preview response
      if (confirmChecked.value && previewResponse.value) {
        // Start the delete spinner
        deleteInProgress.value = true
        // Request an actual delete by sending the confirmation hash
        const res: DeletePIDResponseSchema = await $axios.$post(
          `${$config.apiBase}/v1/patientrecords/${props.item.pid}/delete`,
          {
            hash: previewResponse.value.hash,
          }
        )
        // Populate the updated preview (currently unused)
        previewResponse.value = res
      }
      // Remove the delete spinner
      deleteInProgress.value = false
      // Hide the modal
      hide()
      // Emit an event notifying parents that a record has been deleted
      emit('deleted')
      // Show success toast
      $toast.show({
        type: 'success',
        title: 'Success',
        message: 'Record deleted',
        timeout: 5,
        classTimeout: 'bg-green-600',
      })
    }

    return {
      visible,
      confirmChecked,
      previewResponse,
      deleteResponse,
      previewErrorMessage,
      deleteInProgress,
      doRealDelete,
      cancel,
      show,
      hide,
      toggle,
      formatDate,
    }
  },
})
</script>
