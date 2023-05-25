<template>
  <li>
    <div class="flex flex-col divide-y divide-gray-200">
      <!-- Main record info and menu button -->
      <div class="flex divide-x divide-gray-200">
        <!-- Main record info -->
        <NuxtLink :to="`/patientrecords/${item.pid}`" class="flex-grow">
          <div class="flex min-w-0 items-center gap-2 hover:bg-gray-50">
            <div class="grid w-full min-w-0 flex-1 grid-cols-3 items-center gap-2 py-4 pl-4 sm:pl-6 lg:grid-cols-4">
              <!-- Sender -->
              <div v-if="showSender">
                <div class="flex items-center gap-2">
                  <BaseBadge v-if="badgeStatus === 1" class="w-14 bg-green-100 text-center text-green-800"
                    >Active</BaseBadge
                  >
                  <BaseBadge v-if="badgeStatus === 2" class="w-14 bg-red-100 text-center text-red-800"
                    >Closed</BaseBadge
                  >
                  <BaseBadge v-if="badgeStatus === 3" class="w-14 bg-yellow-100 text-center text-yellow-800"
                    >Mixed</BaseBadge
                  >
                  <SendingFacilityLink class="font-medium" :code="item.sendingfacility" />
                </div>

                <p class="mt-2">via {{ item.sendingextract }}</p>
              </div>
              <!-- Name, DoB, gender -->
              <div>
                <span class="line-clamp-1">
                  <h5 class="sensitive inline truncate capitalize">{{ item.patient?.names[0].given.toLowerCase() }}</h5>
                  <h5 class="sensitive inline truncate capitalize italic">
                    {{ item.patient?.names[0].family.toLowerCase() }}
                  </h5>
                  <h5 class="sensitive ml-1 inline">
                    {{ item.patient?.gender ? formatGenderCharacter(item.patient?.gender) : "?" }}
                  </h5>
                </span>
                <p class="sensitive mt-2 flex items-center">
                  {{ item.patient?.birthTime ? formatDate(item.patient?.birthTime, false) : "Unknown date of birth" }}
                  {{ item.patient?.deathTime ? ` – ${formatDate(item.patient?.deathTime, false)}` : "" }}
                </p>
              </div>
              <!-- Primary Identifier (medium breakpoint only) -->
              <div v-if="primaryIdentifier" class="hidden sm:block">
                <h5 class="truncate">{{ primaryIdentifier.label }} Number</h5>
                <p class="sensitive mt-2 truncate">
                  {{ primaryIdentifier.number ?? "" }}
                </p>
              </div>
              <!-- UKRDC ID (large breakpoint only) -->
              <div class="hidden lg:block">
                <h5>UKRDC ID</h5>
                <p class="sensitive mt-2">
                  {{ item.ukrdcid }}
                </p>
              </div>
              <!-- PID (only if sender column is hidden) -->
              <div v-if="!showSender">
                <h5>PID</h5>
                <p class="sensitive mt-2">
                  {{ item.pid }}
                </p>
              </div>
            </div>
          </div>
        </NuxtLink>

        <PatientRecordManageMenu
          v-if="showManageMenu"
          class="flex flex-grow-0 items-center"
          :show-pv-sync="showPvSync"
          :show-radar-sync="showRadarSync"
          :show-pkb-sync="showPkbSync"
          :item="item"
          @deleted="$emit('deleted')"
        />
      </div>

      <!-- Peek button -->
      <div
        class="group flex h-8 w-full cursor-pointer justify-center gap-2 hover:bg-gray-50"
        @click="showDetail = !showDetail"
      >
        <div class="flex items-center gap-2">
          <IconChevronDown
            class="inline h-5 w-5 transform text-gray-500 transition group-hover:text-gray-800"
            :class="[showDetail ? 'rotate-180' : '']"
          />
          <p class="text-sm text-gray-500 group-hover:text-gray-800">
            {{ showDetail ? "HIDE RECORD" : "PEEK RECORD" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Collapsible details -->
    <div v-show="showDetail" class="bg-gray-50 px-4 py-4 shadow-inner sm:px-6">
      <PatientRecordPeek :record="item" />
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseBadge from "~/components/base/BaseBadge.vue";
import PatientRecordManageMenu from "~/components/patientrecord/PatientRecordManageMenu.vue";
import PatientRecordPeek from "~/components/patientrecord/PatientRecordPeek.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import { formatGenderCharacter } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { firstMRN, firstNI } from "~/helpers/recordUtils";

import IconChevronDown from "../icons/hero/24/solid/IconChevronDown.vue";

interface localNumber {
  label: string;
  number: string;
}

enum BadgeStatusEnum {
  Open = 1,
  Closed = 2,
  Mixed = 3,
  Unknown = 0,
}

export default defineComponent({
  components: {
    IconChevronDown,
    BaseBadge,
    SendingFacilityLink,
    PatientRecordManageMenu,
    PatientRecordPeek,
  },
  props: {
    item: {
      type: Object as () => PatientRecordSummarySchema,
      required: true,
    },
    showSender: {
      type: Boolean,
      required: false,
      default: true,
    },
    showManageMenu: {
      type: Boolean,
      required: false,
      default: true,
    },
    preferNiOverMrn: {
      type: Boolean,
      required: false,
      default: false,
    },
    showPvSync: {
      type: Boolean,
      required: false,
      default: false,
    },
    showRadarSync: {
      type: Boolean,
      required: false,
      default: false,
    },
    showPkbSync: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const showDetail = ref(false);

    const firstMRNObject = computed<localNumber | null>(() => {
      return firstMRN(props.item);
    });

    const firstNIObject = computed<localNumber | null>(() => {
      return firstNI(props.item);
    });

    const primaryIdentifier = computed<localNumber | null>(() => {
      if (props.preferNiOverMrn) {
        return firstNIObject.value ?? firstMRNObject.value;
      } else {
        return firstMRNObject.value ?? firstNIObject.value;
      }
    });

    const badgeStatus = computed(() => {
      if (props.item.programMemberships) {
        const open = props.item.programMemberships.filter((pm) => !pm.toTime).length;
        const closed = props.item.programMemberships.filter((pm) => pm.toTime).length;
        if (open > 0 && closed > 0) {
          return BadgeStatusEnum.Mixed;
        } else if (open > 0) {
          return BadgeStatusEnum.Open;
        } else if (closed > 0) {
          return BadgeStatusEnum.Closed;
        } else {
          return BadgeStatusEnum.Unknown;
        }
      } else {
        return BadgeStatusEnum.Unknown;
      }
    });

    return { showDetail, formatDate, formatGenderCharacter, primaryIdentifier, badgeStatus };
  },
});
</script>