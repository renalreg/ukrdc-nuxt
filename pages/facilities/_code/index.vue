<template>
  <div>
    <NuxtLink :to="`/facilities/${facility.id}/errors`">
      <genericAlertError
        v-if="(facility.statistics.patientsReceivingMessageError || 0) > 0"
        class="mb-4"
        :message="`${facility.statistics.patientsReceivingMessageError} patients are not receiving data due to errors in their incoming files. Click for details.`"
      >
      </genericAlertError>
    </NuxtLink>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="col-span-1 flex flex-col gap-4 lg:col-span-2">
        <!-- Basic stats -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GenericCard>
            <div class="flex items-center p-4">
              <div class="flex-shrink-0">
                <IconUsers />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <GenericCardDt>Total Records</GenericCardDt>
                  <dd class="flex items-baseline">
                    <TextHc class="flex-grow">{{ facility.statistics.totalPatients }}</TextHc>
                    <NuxtLink
                      class="hover:underline"
                      :to="{ path: `/masterrecords/`, query: { facility: facility.id } }"
                    >
                      Show all records
                    </NuxtLink>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-2 text-sm text-gray-500">
              Total records ever stored in the UKRDC for this facility
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
                      :class="
                        (facility.statistics.patientsReceivingMessageError || 0) > 0 ? 'text-red-600' : 'text-green-700'
                      "
                    >
                      {{ facility.statistics.patientsReceivingMessageError }}
                    </TextHc>
                    <NuxtLink class="hover:underline" :to="`/facilities/${facility.id}/errors`"> Show errors </NuxtLink>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-2 text-sm text-gray-500">Active records currently failing due to errors</div>
          </GenericCard>
        </div>

        <!-- Error history -->
        <GenericCard>
          <GenericCardHeader>
            <TextH2> Error History </TextH2>
          </GenericCardHeader>
          <FacilitiesErrorsHistoryPlot :facility="facility" />
        </GenericCard>

        <!-- Record types -->

        <GenericTable>
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 text-left">
                <TextTh>Feed Type</TextTh>
              </th>
              <th scope="col" class="hidden px-4 py-3 text-left md:table-cell">
                <TextTh>Status</TextTh>
              </th>
              <th scope="col" class="px-4 py-3 text-left">
                <TextTh>Total Records</TextTh>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="item in feedTableItems" :key="item.key">
              <GenericTableCell class="font-medium text-gray-900">{{ item.name }}</GenericTableCell>
              <GenericTableCell class="hidden md:table-cell">
                <div v-if="item.historic" class="flex items-center">
                  <IconCircle v-if="item.historic" class="inline text-orange-400" />
                  <p>Historic</p>
                </div>
                <div v-else class="flex items-center">
                  <IconCircle class="inline" :class="extracts[item.key] > 0 ? 'text-green-600' : 'text-red-700'" />
                  <p>{{ extracts[item.key] > 0 ? "Enabled" : "Unused" }}</p>
                </div>
              </GenericTableCell>
              <GenericTableCell>{{ extracts[item.key] > 0 ? extracts[item.key] : "" }}</GenericTableCell>
            </tr>
          </tbody>
        </GenericTable>
      </div>

      <!-- Alerts -->
      <div class="col-span-1 flex flex-col gap-4">
        <GenericCard>
          <GenericCardHeader>
            <TextH2>Alerts</TextH2>
          </GenericCardHeader>

          <GenericCardContent>
            <ul role="list" class="-my-5 divide-y divide-gray-200">
              <li v-if="hasPermission('ukrdc:messages:read')" class="py-5">
                <div v-if="!facility.lastMessageReceivedAt" class="flex items-center">
                  <IconCircle class="inline text-red-600" />
                  <TextH3> Data flow inactive </TextH3>
                </div>
                <div v-else-if="facilityLastMessageOver48(facility)" class="flex items-center">
                  <IconCircle class="inline text-orange-400" />
                  <TextH3> Data flow warning </TextH3>
                </div>
                <div v-else class="flex items-center">
                  <IconCircle class="inline text-green-600" />
                  <TextH3> Data flow active </TextH3>
                </div>
                <TextP class="mt-1">
                  {{ latestDataInfo }}
                </TextP>
              </li>
              <li v-if="extracts && extracts.ukrdc <= 0" class="py-5">
                <div class="flex items-center">
                  <IconCircle class="inline text-red-600" />
                  <TextH3> Statistics unavailable </TextH3>
                </div>
                <TextP class="mt-1">
                  Statistics are based on UKRDC data, and PatientView records are not included.
                </TextP>
                <TextP class="mt-1">
                  You currently have no UKRDC records, and so statistics are currently unavailable.
                </TextP>
                <TextP class="mt-1">
                  For more information, please refer to our
                  <a href="https://renalregistry.atlassian.net/wiki/spaces/UD/overview" target="_blank">
                    UKRDC feed documentation.
                  </a>
                </TextP>
              </li>
              <li v-if="extracts && extracts.ukrdc > 0" class="py-5">
                <div class="flex items-center">
                  <IconCircle class="inline text-indigo-600" />
                  <TextH3> UKRDC statistics </TextH3>
                </div>
                <TextP class="mt-1">
                  Statistics are based on UKRDC data, and PatientView records are not included.
                </TextP>
                <TextP class="mt-1"> You currently have {{ extracts.ukrdc }} UKRDC records. </TextP>
              </li>
            </ul>
          </GenericCardContent>
        </GenericCard>

        <GenericCard>
          <GenericCardHeader>
            <TextH2>Data Flow</TextH2>
          </GenericCardHeader>

          <GenericCardContent v-if="facility && facility.dataFlow">
            <ul role="list" class="-my-5 divide-y divide-gray-200">
              <li class="py-5">
                <div class="flex items-center">
                  <IconCircle v-if="facility.dataFlow.pkbOut" class="inline text-green-600" />
                  <IconCircle v-else class="inline text-red-600" />
                  <TextH3> PKB Outbound </TextH3>
                </div>
                <TextP class="mt-1">
                  Data sending to
                  <a class="hover:underline" href="https://patientsknowbest.com/" target="blank">
                    Patients Know Best
                  </a>
                  is {{ facility.dataFlow.pkbOut ? "enabled" : "disabled" }}.
                </TextP>
                <TextP v-if="facility.dataFlow.pkbOut">
                  Data will only be sent to PKB for patients with a PKB membership record.
                </TextP>
              </li>
            </ul>
          </GenericCardContent>
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { FacilityDetailsSchema, FacilityExtractsSchema } from "@ukkidney/ukrdc-axios-ts";
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
    extracts: {
      type: Object as () => FacilityExtractsSchema,
      required: true,
    },
  },

  setup(props) {
    const { hasPermission } = usePermissions();

    // Computed string for the latest data received
    const latestDataInfo = computed(() => {
      if (!props.facility.lastMessageReceivedAt) {
        return "No data files received from this facility in over a year";
      } else {
        return `Latest data file recieved on ${formatDate(props.facility.lastMessageReceivedAt, true)}`;
      }
    });

    interface FeedTableItem {
      name: string;
      key: keyof FacilityExtractsSchema;
      historic: boolean;
    }

    const feedTableItems: FeedTableItem[] = [
      {
        name: "UKRDC Records",
        key: "ukrdc",
        historic: false,
      },
      {
        name: "PatientView Records",
        key: "pv",
        historic: false,
      },
      {
        name: "RADAR Records",
        key: "radar",
        historic: false,
      },
      {
        name: "PatientView Migrated Records",
        key: "pvmig",
        historic: true,
      },
      {
        name: "HealthShare Migrated Records",
        key: "hsmig",
        historic: true,
      },
      {
        name: "Survey Feeds",
        key: "survey",
        historic: false,
      },
      {
        name: "UKRR Extract Records",
        key: "ukrr",
        historic: false,
      },
    ];

    return {
      hasPermission,
      facilityLastMessageOver48,
      allStatuses,
      latestDataInfo,
      feedTableItems,
    };
  },
});
</script>
