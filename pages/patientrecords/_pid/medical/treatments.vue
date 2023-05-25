<template>
  <div class="sensitive">
    <BaseLoadingContainer :loading="!treatments">
      <p v-if="treatments && treatments.length <= 0" class="text-center">No treatments on record</p>
      <div v-else-if="treatments && treatments.length > 0" class="flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="(treatment, index) in treatmentEvents" :key="index">
            <div class="relative pb-8">
              <span
                v-if="index != treatmentEvents.length - 1"
                class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              ></span>
              <div class="relative flex space-x-3">
                <div v-if="treatment.isDischarge">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                    <!-- Heroicon name: solid/check -->
                    <svg
                      class="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div v-else>
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white">
                    <!-- Heroicon name: solid/login -->
                    <svg
                      class="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div class="flex min-w-0 items-center gap-2">
                  <div class="flex-shrink">
                    <p class="mr-2 inline font-bold">
                      <time :datetime="treatment.time">{{ treatment.time }}</time>
                    </p>
                    <div v-if="treatment.isDischarge" class="inline">
                      Discharged from
                      {{ treatment.admitReasonDesc ? treatment.admitReasonDesc : treatment.admitReasonCode }} at
                      <h5 class="inline">{{ treatment.healthCareFacilityCode }}</h5>
                      {{
                        treatment.dischargeReasonDesc
                          ? `(${treatment.dischargeReasonDesc})`
                          : treatment.dischargeReasonCode
                          ? `(${treatment.dischargeReasonCode})`
                          : ""
                      }}
                    </div>
                    <div v-else class="inline">
                      {{ treatment.time }} - Admitted to
                      <h5 class="inline">{{ treatment.healthCareFacilityCode }}</h5>
                      for
                      {{ treatment.admitReasonDesc ? treatment.admitReasonDesc : treatment.admitReasonCode }}
                    </div>
                  </div>
                  <BaseInfoTooltip>
                    <div class="sensitive">
                      <p><b>From time: </b>{{ treatment.fromTime }}</p>
                      <p><b>To time: </b>{{ treatment.toTime || "None" }}</p>
                      <br />
                      <p><b>Admin reason: </b>{{ treatment.admitReasonDesc || "None" }}</p>
                      <p>
                        <b>Admin reason code: </b>{{ treatment.admitReasonCodeStd }} / {{ treatment.admitReasonCode }}
                      </p>
                      <br />
                      <p><b>Discharge reason: </b>{{ treatment.dischargeReasonDesc || "None" }}</p>
                      <p>
                        <b>Discharge reason code: </b>{{ treatment.dischargeReasonCodeStd || "None" }} /
                        {{ treatment.dischargeReasonCode || "None" }}
                      </p>
                    </div>
                  </BaseInfoTooltip>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </BaseLoadingContainer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { PatientRecordSchema, TreatmentSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseInfoTooltip from "~/components/base/BaseInfoTooltip.vue";
import BaseLoadingContainer from "~/components/base/BaseLoadingContainer.vue";
import useApi from "~/composables/useApi";

interface TreatmentEvent extends TreatmentSchema {
  time?: string;
  isDischarge: boolean;
}

export default defineComponent({
  components: {
    BaseLoadingContainer,
    BaseInfoTooltip,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { patientRecordsApi } = useApi();

    // Data refs
    const treatments = ref<TreatmentSchema[]>();

    // Data fetching
    onMounted(() => {
      patientRecordsApi
        .getPatientTreatments({
          pid: props.record.pid,
        })
        .then((response) => {
          treatments.value = response.data;
        });
    });

    // Sorted and paired treatment events
    const treatmentEvents = computed(() => {
      const events: TreatmentEvent[] = [];
      for (const treatment of treatments.value || []) {
        if (treatment.toTime) {
          const event = {
            time: treatment.toTime,
            isDischarge: true,
            ...treatment,
          };
          events.push(event);
        }
        const event = {
          time: treatment.fromTime,
          isDischarge: false,
          ...treatment,
        };
        events.push(event);
      }
      events.sort(function (a, b) {
        if (a.time === undefined || b.time === undefined) {
          return 0;
        }
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        if (a.time === b.time) {
          // If they're part of the same treatment
          if (a.admitReasonDesc === b.admitReasonDesc) {
            // Admit before discharge
            return (b.isDischarge ? 1 : 0) - (a.isDischarge ? 1 : 0);
          } else {
            // Discharge before admit
            return (a.isDischarge ? 1 : 0) - (b.isDischarge ? 1 : 0);
          }
        }
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      return events;
    });

    return {
      treatments,
      treatmentEvents,
    };
  },
});
</script>