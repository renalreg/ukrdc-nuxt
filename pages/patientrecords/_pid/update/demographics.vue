<template>
  <div>
    <BaseModalConfirm ref="postUpdateConfirm" title="Apply Update?" :danger="false" @confirm="postUpdate">
      <p class="mb-2">Are you sure you want to apply modified demographics for this patient?</p>
    </BaseModalConfirm>

    <div v-if="!hasPermission('ukrdc:records:write')">
      <p>You do not have permission to update demographics.</p>
    </div>

    <BaseLoadingContainer v-else :loading="!related">
      <div class="mb-4">
        <h2 class="mb-4">Update Demographics</h2>
        <p>Select an item on the left, and assign a new value from the options on the right.</p>
      </div>

      <div class="grid grid-cols-2 items-start gap-8">
        <!-- Current Values -->
        <div class="col-span-1 grid gap-2">
          <!-- Name block -->
          <div
            class="demo-section-card-base"
            :class="[selectedBlock === 'name' ? 'demo-section-card-active' : 'demo-section-card-inactive']"
            @click="selectedBlock = 'name'"
          >
            <div>
              <h5>Given Name</h5>
              <p class="sensitive">
                {{ nameToUse.name?.given }}
              </p>
            </div>
            <div>
              <h5>Family Name</h5>
              <p class="sensitive">
                {{ nameToUse.name?.family }}
              </p>
            </div>
          </div>
          <!-- DoB block -->
          <div
            class="demo-section-card-base"
            :class="[selectedBlock === 'dob' ? 'demo-section-card-active' : 'demo-section-card-inactive']"
            @click="selectedBlock = 'dob'"
          >
            <h5>Date of Birth</h5>
            <p class="sensitive">
              {{ birthTimeToUse.birthTime ? formatDate(birthTimeToUse.birthTime, false) : "No date of birth" }}
            </p>
          </div>
          <!-- Gender block -->
          <div
            class="demo-section-card-base"
            :class="[selectedBlock === 'gender' ? 'demo-section-card-active' : 'demo-section-card-inactive']"
            @click="selectedBlock = 'gender'"
          >
            <h5>Gender</h5>
            <p class="sensitive">
              {{ genderToUse.gender ? formatGender(genderToUse.gender) : "No gender on record" }}
            </p>
          </div>
          <!-- Address block -->
          <div
            class="demo-section-card-base sensitive"
            :class="[selectedBlock === 'address' ? 'demo-section-card-active' : 'demo-section-card-inactive']"
            @click="selectedBlock = 'address'"
          >
            <h5>Address</h5>
            <PatientRecordAddress :address="addressToUse.address" />
          </div>

          <BaseButton @click="postUpdateConfirm?.show()">Apply Changes</BaseButton>
        </div>

        <!-- Available Options -->
        <div class="col-span-1">
          <!-- Names block -->
          <div v-if="selectedBlock === 'name'" class="grid gap-2">
            <div
              v-for="(name, index) in namesAvailable"
              :key="`name-${index}`"
              class="demo-section-card-base"
              :class="[isEqual(name, nameToUse) ? 'demo-section-card-selected' : 'demo-section-card-inactive']"
              @click="nameToUse = name"
            >
              <div>
                <h5>Given Name</h5>
                <p class="sensitive">
                  {{ name.name?.given }}
                </p>
              </div>
              <div>
                <h5>Family Name</h5>
                <p class="sensitive">
                  {{ name.name?.family }}
                </p>
              </div>
              <div>
                <h5>Source</h5>
                <p class="sensitive overflow-hidden truncate">
                  {{ name.source }}
                </p>
              </div>
            </div>
          </div>

          <!-- DoB block -->
          <div v-if="selectedBlock === 'dob'" class="grid gap-2">
            <div
              v-for="(birthTime, index) in birthTimesAvailable"
              :key="`birthtime-${index}`"
              class="demo-section-card-base"
              :class="[
                isEqual(birthTime, birthTimeToUse) ? 'demo-section-card-selected' : 'demo-section-card-inactive',
              ]"
              @click="birthTimeToUse = birthTime"
            >
              <div>
                <h5>Date of Birth</h5>
                <p class="sensitive">
                  {{ birthTime.birthTime ? formatDate(birthTime.birthTime, false) : "No date of birth" }}
                </p>
              </div>
              <div>
                <h5>Source</h5>
                <p class="sensitive overflow-hidden truncate">
                  {{ birthTime.source }}
                </p>
              </div>
            </div>
          </div>

          <!-- Gender block -->
          <div v-if="selectedBlock === 'gender'" class="grid gap-2">
            <div
              v-for="(gender, index) in gendersAvailable"
              :key="`gender-${index}`"
              class="demo-section-card-base"
              :class="[isEqual(gender, genderToUse) ? 'demo-section-card-selected' : 'demo-section-card-inactive']"
              @click="genderToUse = gender"
            >
              <div>
                <h5>Gender</h5>
                <p class="sensitive">
                  {{ gender.gender ? formatGender(gender.gender) : "No gender on record" }}
                </p>
              </div>
              <div>
                <h5>Source</h5>
                <p class="sensitive overflow-hidden truncate">
                  {{ gender.source }}
                </p>
              </div>
            </div>
          </div>

          <!-- Addresses block -->
          <div v-if="selectedBlock === 'address'" class="grid gap-2">
            <div
              v-for="(address, index) in addressesAvailable"
              :key="`address-${index}`"
              class="demo-section-card-base"
              :class="[isEqual(address, addressToUse) ? 'demo-section-card-selected' : 'demo-section-card-inactive']"
              @click="addressToUse = address"
            >
              <div class="md:col-span-2">
                <h5>Address</h5>
                <PatientRecordAddress :address="address.address" />
              </div>
              <div>
                <h5>Source</h5>
                <p class="sensitive overflow-hidden truncate">
                  {{ address.source }}
                </p>
              </div>
            </div>
          </div>
          <!-- Change depending on which element is selected on the left -->
          <!-- Current -->
          <!-- Each related record -->
        </div>
      </div>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext, useRouter } from "@nuxtjs/composition-api";
import { AddressSchema, NameSchema, PatientRecordSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";
import { isEqual } from "lodash";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import BaseModalConfirm from "~/components/base/BaseModalConfirm.vue";
import PatientRecordAddress from "~/components/PatientRecordAddress.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";
import { ModalInterface } from "~/interfaces/modal";

type SelectableBlock = "name" | "dob" | "gender" | "address";
type GenderEnum = "1" | "2" | "9";
const currentRecordSource = "Current Record";

interface AvailableName {
  name: NameSchema | undefined;
  source: string;
}

interface AvailableBirthTime {
  birthTime: string | undefined;
  source: string;
}

interface AvailableGender {
  gender: GenderEnum | undefined;
  source: string;
}

interface AvailableAddress {
  address: AddressSchema | undefined;
  source: string;
}

export default defineComponent({
  components: {
    BaseLoadingContainer,
    BaseModalConfirm,
    BaseButton,
    PatientRecordAddress,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
    related: {
      type: Array as () => PatientRecordSummarySchema[],
      required: false,
      default: undefined,
    },
  },

  setup(props) {
    const router = useRouter();
    const { $toast } = useContext();
    const { hasPermission } = usePermissions();
    const { patientRecordsApi } = useApi();

    // Modals

    const postUpdateConfirm = ref<ModalInterface>();

    const selectedBlock = ref<SelectableBlock>();

    const nameToUse = ref<AvailableName>({
      name: props.record.patient?.names[0],
      source: currentRecordSource,
    });
    const birthTimeToUse = ref<AvailableBirthTime>({
      birthTime: props.record.patient?.birthTime,
      source: currentRecordSource,
    });
    const genderToUse = ref<AvailableGender>({
      gender: props.record.patient?.gender,
      source: currentRecordSource,
    });
    const addressToUse = ref<AvailableAddress>({
      address: props.record.patient?.addresses[0],
      source: currentRecordSource,
    });

    function getRecordSourceName(record: PatientRecordSummarySchema) {
      return `From ${record.sendingfacility} via ${record.sendingextract}`;
    }

    const namesAvailable = computed(() => {
      const names: AvailableName[] = [
        {
          name: props.record.patient?.names[0],
          source: currentRecordSource,
        },
      ];

      // For each related record
      for (const record of props.related ?? []) {
        // If the record has a name
        if (record.patient?.names[0] && record.pid !== props.record.pid) {
          names.push({
            name: record.patient?.names[0],
            source: getRecordSourceName(record),
          });
        }
      }
      return names;
    });

    const birthTimesAvailable = computed(() => {
      const birthTimes: AvailableBirthTime[] = [
        {
          birthTime: props.record.patient?.birthTime,
          source: currentRecordSource,
        },
      ];

      // For each related record
      for (const record of props.related ?? []) {
        // If the record has a name
        if (record.patient?.birthTime && record.pid !== props.record.pid) {
          birthTimes.push({
            birthTime: record.patient?.birthTime,
            source: getRecordSourceName(record),
          });
        }
      }
      return birthTimes;
    });

    const gendersAvailable = computed(() => {
      const genders: AvailableGender[] = [
        {
          gender: props.record.patient?.gender,
          source: currentRecordSource,
        },
      ];

      // For each related record
      for (const record of props.related ?? []) {
        // If the record has a name
        if (record.patient?.gender && record.pid !== props.record.pid) {
          genders.push({
            gender: record.patient?.gender,
            source: getRecordSourceName(record),
          });
        }
      }
      return genders;
    });

    const addressesAvailable = computed(() => {
      const addresses: AvailableAddress[] = [
        {
          address: props.record.patient?.addresses[0],
          source: currentRecordSource,
        },
      ];

      // For each related record
      for (const record of props.related ?? []) {
        // If the record has a name
        if (record.patient?.addresses[0] && record.pid !== props.record.pid) {
          addresses.push({
            address: record.patient?.addresses[0],
            source: getRecordSourceName(record),
          });
        }
      }
      return addresses;
    });

    function postUpdate() {
      const requestParams = {
        name: nameToUse.value.name,
        birthTime: birthTimeToUse.value.birthTime,
        gender: genderToUse.value.gender,
        address: addressToUse.value.address,
      };
      patientRecordsApi
        .postPatientUpdateDemographics({
          pid: props.record.pid,
          demographicUpdateRequest: requestParams,
        })
        .then(() => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "Record demographics updated successfully",
            timeout: 10,
            classTimeout: "bg-green-600",
          });
          router.push(`/masterrecords/${props.record.masterId}`);
        })
        .catch((error) => {
          $toast.show({
            type: "error",
            title: "Error",
            message: "Failed to update record demographics",
            timeout: 10,
            classTimeout: "bg-red-600",
          });
          throw error;
        });
    }

    return {
      formatDate,
      formatGender,
      isEmptyObject,
      isEqual,
      hasPermission,
      postUpdateConfirm,
      selectedBlock,
      nameToUse,
      birthTimeToUse,
      genderToUse,
      addressToUse,
      namesAvailable,
      birthTimesAvailable,
      gendersAvailable,
      addressesAvailable,
      postUpdate,
    };
  },
});
</script>

<style lang="postcss">
.demo-section-card-inactive {
  @apply border border-gray-300 bg-white shadow-sm;
}
.demo-section-card-active {
  @apply border-2 border-indigo-500 bg-white shadow-sm;
}
.demo-section-card-selected {
  @apply border-2 border-green-500 bg-white shadow-sm;
}
.demo-section-card-base {
  @apply grid cursor-pointer grid-cols-1 overflow-hidden rounded-md p-4 md:grid-cols-2 lg:grid-cols-3;
}
</style>
