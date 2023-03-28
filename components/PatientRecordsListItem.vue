<template>
  <li>
    <div class="flex min-w-0 items-center gap-2">
      <div class="grid w-full min-w-0 flex-1 grid-cols-2 gap-2 py-4 pl-4 sm:grid-cols-3 sm:pl-6 lg:grid-cols-4">
        <!-- Name, DoB, gender -->
        <div>
          <div class="flex items-center gap-2">
            <SendingFacilityLink class="font-medium" :code="item.sendingfacility" />
            <BaseBadge v-if="badgeStatus === 2" class="bg-red-100 text-red-800">Closed</BaseBadge>
            <BaseBadge v-if="badgeStatus === 3" class="bg-yellow-100 text-yellow-800">Mixed</BaseBadge>
          </div>

          <p class="mt-2">via {{ item.sendingextract }}</p>
        </div>
        <!-- National ID -->
        <div>
          <span class="truncate">
            <h5 class="sensitive inline capitalize">{{ item.patient?.names[0].given.toLowerCase() }}</h5>
            <h5 class="sensitive inline capitalize italic">{{ item.patient?.names[0].family.toLowerCase() }}</h5>
          </span>
          <p class="sensitive mt-2 flex items-center">
            {{ item.patient?.birthTime ? formatDate(item.patient?.birthTime, false) : "Unknown date of birth" }}
            <b class="ml-1">
              {{ item.patient?.gender ? formatGenderCharacter(item.patient?.gender) : "Unknown gender" }}</b
            >
          </p>
        </div>
        <!-- MRN (medium breakpoint only) -->
        <div class="hidden sm:block">
          <h5 class="truncate">{{ firstMRNObject.label }} Number</h5>
          <p class="sensitive mt-2 truncate">
            {{ firstMRNObject.number }}
          </p>
        </div>
        <!-- UKRDC ID (large breakpoint only) -->
        <div class="hidden lg:block">
          <h5>UKRDC ID</h5>
          <p class="sensitive mt-2">
            {{ item.ukrdcid }}
          </p>
        </div>
      </div>
      <!-- Record links -->
      <div class="flex flex-shrink-0 items-center gap-2 pr-2">
        <div class="flex flex-grow flex-col-reverse gap-2 xl:flex-row">
          <BaseButtonMini class="h-8 truncate" @click="showDetail = !showDetail">
            {{ showDetail ? "Hide Record" : "Peek Record" }}
          </BaseButtonMini>
          <BaseButtonMini :to="`/patientrecords/${item.pid}`" class="h-8 truncate"> Open Record </BaseButtonMini>
        </div>
        <div class="flex-grow-0">
          <PatientRecordManageMenu
            :show-pv-sync="showPvSync"
            :show-radar-sync="showRadarSync"
            :show-pkb-sync="showPkbSync"
            :item="item"
            @deleted="$emit('deleted')"
          />
        </div>
      </div>
    </div>
    <!-- Collapsible details -->
    <div v-show="showDetail" class="bg-gray-50 px-4 py-4 shadow-inner sm:px-6">
      <PatientRecordDetailCards :record="item" />
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseBadge from "~/components/base/BaseBadge.vue";
import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import PatientRecordDetailCards from "~/components/PatientRecordDetailCards.vue";
import PatientRecordManageMenu from "~/components/PatientRecordManageMenu.vue";
import SendingFacilityLink from "~/components/SendingFacilityLink.vue";
import { formatGenderCharacter } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { firstMRN } from "~/helpers/recordUtils";

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
    BaseButtonMini,
    BaseBadge,
    SendingFacilityLink,
    PatientRecordManageMenu,
    PatientRecordDetailCards,
  },
  props: {
    item: {
      type: Object as () => PatientRecordSummarySchema,
      required: true,
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

    const firstMRNObject = computed<localNumber>(() => {
      return firstMRN(props.item);
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

    return { showDetail, formatDate, formatGenderCharacter, firstMRNObject, badgeStatus };
  },
});
</script>
