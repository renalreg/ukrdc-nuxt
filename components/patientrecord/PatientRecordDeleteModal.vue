<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-screen w-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <!-- Background overlay, show/hide based on modal state. -->
        <BaseBlackout :visible="visible" @click="hide()" />

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <!-- Modal panel, show/hide based on modal state. -->
        <ModalTransition>
          <div
            v-show="visible"
            class="inline-block w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-3/4 sm:max-w-3xl sm:p-6 sm:align-middle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <!-- Heroicon name: outline/exclamation -->
                <svg
                  class="h-6 w-6 text-red-600"
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
              <div class="ml-8 mt-3 text-left sm:ml-4 sm:mt-0">
                <h3 id="modal-headline" class="text-lg font-medium leading-6 text-gray-900">
                  {{ previewErrorMessage ? "Unable to delete patient record" : "Delete patient record" }}
                </h3>
                <div class="mb-4 mt-2">
                  <div v-if="previewErrorMessage">
                    <p>{{ previewErrorMessage }}</p>
                  </div>
                  <div v-if="previewResponse && !deleteInProgress">
                    <h3 class="mb-2">The following data will be permanantly deleted</h3>
                    <ul class="sensitive list-disc">
                      <li>
                        Patient record {{ previewResponse.patientRecord.pid }} - UKRDCID
                        {{ previewResponse.patientRecord.ukrdcid }} - Created
                        {{ formatDate(previewResponse.patientRecord.repositoryCreationDate, false) }}
                        <ul class="ml-4 list-disc">
                          <li v-if="previewResponse.patientRecord.programMemberships.length > 0">
                            {{ previewResponse.patientRecord.programMemberships.length }} program memberships
                            <ul class="ml-4 list-disc">
                              <li
                                v-for="membership in previewResponse.patientRecord.programMemberships"
                                :key="membership.programName"
                              >
                                {{ membership.programName }} since {{ formatDate(membership.fromTime, false) }}
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
                            {{ formatDate(previewResponse.patientRecord.patient.birthTime, false) }}
                            <ul class="ml-4 list-disc">
                              <li
                                v-for="name in previewResponse.patientRecord.patient.names"
                                :key="name.given + name.family"
                              >
                                Patient Name {{ name.given }} {{ name.family }}
                              </li>
                            </ul>
                            <ul class="ml-4 list-disc">
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
                        <ul class="ml-4 list-disc">
                          <li v-for="masterRecord in previewResponse.empi.masterRecords" :key="masterRecord.id">
                            Master Record {{ masterRecord.id }} - {{ masterRecord.givenname }}
                            {{ masterRecord.surname }} - Date of Birth
                            {{ formatDate(masterRecord.dateOfBirth, false) }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.persons.length > 0">
                        {{ previewResponse.empi.persons.length }} Person Records
                        <ul class="ml-4 list-disc">
                          <li v-for="person in previewResponse.empi.persons" :key="person.id">
                            Person {{ person.id }} - {{ person.givenname }} {{ person.surname }} - Date of Birth
                            {{ formatDate(person.dateOfBirth, false) }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.linkRecords.length > 0">
                        {{ previewResponse.empi.linkRecords.length }} Link Records
                        <ul class="ml-4 list-disc">
                          <li v-for="linkRecord in previewResponse.empi.linkRecords" :key="linkRecord.id">
                            Link Record {{ linkRecord.id }} - Person {{ linkRecord.personId }} linked to Master Record
                            {{ linkRecord.masterId }}
                          </li>
                        </ul>
                      </li>

                      <li v-if="previewResponse.empi.pidxrefs.length > 0">
                        {{ previewResponse.empi.pidxrefs.length }} PID Cross References
                        <ul class="ml-4 list-disc">
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
                <BaseCheckbox
                  v-if="(previewResponse && !previewErrorMessage) || deleteInProgress"
                  v-model="confirmChecked"
                  :disabled="!previewResponse"
                  label="Yes, delete this record and all associated data"
                />
              </div>
            </div>
            <div v-if="(!previewErrorMessage && !previewResponse) || deleteInProgress" class="w-full">
              <BaseLoadingIndicator></BaseLoadingIndicator>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <BaseButton
                v-if="previewResponse && !previewErrorMessage"
                class="ml-2"
                colour="red"
                :primary="true"
                :disabled="!confirmChecked || deleteInProgress"
                @click="doRealDelete()"
              >
                Delete
              </BaseButton>
              <BaseButton @click="cancel()"> Cancel </BaseButton>
            </div>
          </div>
        </ModalTransition>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, watch } from "@nuxtjs/composition-api";
import {
  LinkRecordSchema,
  MasterRecordSchema,
  PatientRecordSchema,
  PersonSchema,
  PidXRefSchema,
  WorkItemSchema,
} from "@ukkidney/ukrdc-axios-ts";

import BaseBlackout from "~/components/base/BaseBlackout.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseCheckbox from "~/components/base/BaseCheckbox.vue";
import BaseLoadingIndicator from "~/components/base/BaseLoadingIndicator.vue";
import ModalTransition from "~/components/transition/ModalTransition.vue";
import useApi from "~/composables/useApi";
import useModal from "~/composables/useModal";
import { formatDate } from "~/helpers/dateUtils";

interface DeletePIDFromEMPISchema {
  persons: PersonSchema[];
  masterRecords: MasterRecordSchema[];
  pidxrefs: PidXRefSchema[];
  workItems: WorkItemSchema[];
  linkRecords: LinkRecordSchema[];
}

interface DeletePIDResponseSchema {
  hash: string;
  committed: boolean;

  patientRecord: any;
  empi: DeletePIDFromEMPISchema;
}

export default defineComponent({
  components: {
    BaseButton,
    BaseLoadingIndicator,
    BaseCheckbox,
    BaseBlackout,
    ModalTransition,
  },
  props: {
    item: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { $toast } = useContext();
    const { visible, show, hide, toggle } = useModal();
    const { patientRecordsApi } = useApi();

    const confirmChecked = ref(false);
    const previewResponse = ref<DeletePIDResponseSchema>();
    const deleteResponse = ref<DeletePIDResponseSchema>();
    const previewErrorMessage = ref<string>();
    const deleteInProgress = ref(false);

    function cancel(): void {
      emit("cancel");
      hide();
    }

    watch(visible, () => {
      // If the modal becomes visible
      if (visible.value) {
        // Reset the modal each time it's is shown.
        confirmChecked.value = false;
        previewResponse.value = undefined;
        deleteResponse.value = undefined;

        patientRecordsApi
          .postPatientDelete({
            pid: props.item.pid,
            deletePidRequest: {
              hash: undefined,
            },
          })
          .then((response) => {
            previewResponse.value = response.data;
          })
          .catch((error) => {
            previewErrorMessage.value = error.response.data.detail;
          });
      }
    });

    function doRealDelete() {
      // Emit confirm event (currently unused)
      emit("confirm");
      // If the checkbox is checked and we have a preview response
      if (confirmChecked.value && previewResponse.value) {
        // Start the delete spinner
        deleteInProgress.value = true;

        patientRecordsApi
          .postPatientDelete({
            pid: props.item.pid,
            deletePidRequest: {
              hash: previewResponse.value?.hash,
            },
          })
          .then(() => {
            // Hide the modal
            hide();
            // Emit an event notifying parents that a record has been deleted
            emit("deleted");
            // Show success toast
            $toast.show({
              type: "success",
              title: "Success",
              message: "Record deleted",
              timeout: 5,
              classTimeout: "bg-green-600",
            });
          })
          .catch((error) => {
            previewErrorMessage.value = error.response.data.detail;
          })
          .finally(() => {
            // Stop the delete spinner
            deleteInProgress.value = false;
          });
      }
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
    };
  },
});
</script>
