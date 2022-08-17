<template>
  <div>
    <div v-if="facility && !facility.statistics.lastUpdated">
      <TextP>
        No data available. This usually means the service has recently been restarted, and is rebuilding statistics.
      </TextP>
      <TextP> Please try again in a few minutes. </TextP>
    </div>

    <div v-else-if="facility && facility.statistics.lastUpdated">
      <NuxtLink :to="`/facilities/${facility.id}/errors`">
        <genericAlertError
          v-if="facility.statistics.patientsReceivingMessageError > 0"
          class="mb-4"
          :message="`${facility.statistics.patientsReceivingMessageError} patients are not receiving data due to errors in their incoming files. Click for details.`"
        >
        </genericAlertError>
      </NuxtLink>

      <TextL2 class="mb-2"> Last updated {{ lastUpdatedString }} </TextL2>

      <!-- Basic stats -->
      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <GenericCard>
          <div class="flex items-center p-4">
            <div class="flex-shrink-0">
              <IconUsers />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <GenericCardDt>Total Patients</GenericCardDt>
                <dd class="flex items-baseline">
                  <TextHc class="flex-grow">{{ facility.statistics.totalPatients }}</TextHc>
                  <NuxtLink
                    class="hover:underline"
                    :to="{ path: `/masterrecords/`, query: { search: [`facility=${facility.id}`, ''] } }"
                  >
                    Show all patients
                  </NuxtLink>
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-2 text-sm text-gray-500">
            Total patients ever stored in the UKRDC for this facility
          </div>
        </GenericCard>

        <GenericCard>
          <div class="flex items-center p-4">
            <div class="flex-shrink-0">
              <IconCheck />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <GenericCardDt>Active Passing Records</GenericCardDt>
                <dd>
                  <h1 class="text-2xl font-semibold text-green-700">
                    {{ facility.statistics.patientsReceivingMessageSuccess }}
                  </h1>
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-2 text-sm text-gray-500">
            Records with active data files being successfully received
          </div>
        </GenericCard>

        <GenericCard>
          <div class="flex items-center p-4">
            <div class="flex-shrink-0">
              <IconExclamation />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <GenericCardDt>Active Failing Records</GenericCardDt>
                <dd class="flex items-baseline">
                  <TextHc
                    class="flex-grow"
                    :class="facility.statistics.patientsReceivingMessageError > 0 ? 'text-red-600' : 'text-green-700'"
                  >
                    {{ facility.statistics.patientsReceivingMessageError }}
                  </TextHc>
                  <NuxtLink class="hover:underline" :to="`/facilities/${facility.id}/errors`"> Show errors </NuxtLink>
                </dd>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-2 text-sm text-gray-500">
            Records with active data files currently failing due to errors
          </div>
        </GenericCard>
      </div>
    </div>

    <!-- Data flow -->
    <TextH2 class="mb-4">Data Flow</TextH2>

    <div v-if="hasPermission('ukrdc:messages:read')" class="mb-4">
      <NuxtLink :to="{ path: `/messages/`, query: { facility: facility.id, status: allStatuses } }">
        <GenericAlertError v-if="!facility.latestMessage.lastMessageReceivedAt" :message="latestDataInfo" />
        <GenericAlertWarning v-else-if="facilityLastMessageOver48(facility)" :message="latestDataInfo" />
        <GenericAlertInfo v-else :message="latestDataInfo" />
      </NuxtLink>
    </div>

    <div v-if="facility && facility.dataFlow" class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <GenericCard>
        <GenericCardContent>
          <dl>
            <TextDt>
              Sending data to
              <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">Patients Know Best</a>
            </TextDt>
            <TextDd>
              <div v-if="facility && facility.dataFlow.pkbOut" class="flex items-center gap-2">
                <div>Yes</div>
                <IconCheckCircle class="inline text-green-600" />
              </div>
              <div v-else>No</div>
            </TextDd>
          </dl>
        </GenericCardContent>
      </GenericCard>
      <!-- TODO: Add this back in once PKB in is relevant
      <GenericCard>
        <GenericCardContent>
          <dl>
            <TextDt>
              Receiving data from <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">Patients Know Best</a>
            </TextDt>
            <TextDd>
              <div v-if="facility && facility.dataFlow.pkbIn" class="flex items-center gap-2">
                <div>Yes</div>
                <IconCheckCircle class="inline text-green-600" />
              </div>
              <div v-else>No</div>
            </TextDd>
          </dl>
        </GenericCardContent>
      </GenericCard>
          -->
      <GenericCard>
        <GenericCardContent>
          <dl>
            <TextDt>
              Excluding data from
              <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">Patients Know Best</a>
            </TextDt>
            <TextDd>
              <div v-if="facility && facility.dataFlow.pkbMessageExclusions.length > 0" class="flex items-center gap-2">
                <div>{{ facility.dataFlow.pkbMessageExclusions.join(", ") }}</div>
              </div>
              <div v-else>None</div>
            </TextDd>
          </dl>
        </GenericCardContent>
      </GenericCard>
    </div>

    <!-- Demographic distributions -->
    <TextH2 class="mb-4">Patient Demographics</TextH2>
    <FacilitiesStatsDemographics v-if="facility" :facility="facility" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "~/helpers/utils/dateUtils";
import { facilityLastMessageOver48 } from "@/helpers/utils/facilityUtils";
import { allStatuses } from "~/helpers/utils/messageUtils";
import usePermissions from "~/helpers/usePermissions";

export default defineComponent({
  props: {
    facility: {
      type: Object as () => FacilityDetailsSchema,
      required: true,
    },
  },

  setup(props) {
    const { hasPermission } = usePermissions();

    // Computed string for statistics last updated time
    const lastUpdatedString = computed(() => {
      if (props.facility.statistics.lastUpdated) {
        return formatDate(props.facility.statistics.lastUpdated, true);
      } else {
        return "Unknown Time";
      }
    });

    // Computed string for the latest data received
    const latestDataInfo = computed(() => {
      if (!props.facility.latestMessage.lastMessageReceivedAt) {
        return "No data files received from this facility in over a year";
      } else {
        return `Latest data file recieved on ${formatDate(props.facility.latestMessage.lastMessageReceivedAt, true)}`;
      }
    });

    return {
      hasPermission,
      facilityLastMessageOver48,
      allStatuses,
      lastUpdatedString,
      latestDataInfo,
    };
  },
});
</script>
