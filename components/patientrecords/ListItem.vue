<template>
  <li>
    <div class="min-w-0 flex-1 flex items-center">
      <div class="px-4 py-4 sm:px-6 min-w-0 grid grid-cols-3 lg:grid-cols-4 md:gap-4 w-full">
        <!-- Name, DoB, gender -->
        <div>
          <LinkSendingFacility class="font-medium" :code="item.sendingfacility" />
          <TextP class="mt-2"> via {{ item.sendingextract }} </TextP>
        </div>
        <!-- National ID -->
        <div>
          <TextL1 class="capitalize truncate">
            {{ item.patient.names[0].given.toLowerCase() }} {{ item.patient.names[0].family.toLowerCase() }}
          </TextL1>
          <TextP class="mt-2 flex items-center">
            {{ formatDate(item.patient.birthTime, (t = false)) }}
            <b class="ml-1"> {{ formatGenderCharacter(item.patient.gender) }}</b>
          </TextP>
        </div>
        <!-- UKRDC ID (large breakpoint only) -->
        <div class="hidden lg:block">
          <TextL1>UKRDC ID</TextL1>
          <TextP class="mt-2">
            {{ item.ukrdcid }}
          </TextP>
        </div>
        <!-- Record links -->
        <div class="flex items-center gap-2">
          <div class="flex flex-grow flex-col-reverse xl:flex-row gap-2">
            <GenericButtonMini class="flex-1 h-8 truncate" @click="showDetail = !showDetail">
              {{ showDetail ? 'Hide Record' : 'Peek Record' }}
            </GenericButtonMini>
            <GenericButtonMini :to="`/patientrecords/${item.pid}`" class="flex-1 h-8 truncate">
              Open Record
            </GenericButtonMini>
          </div>
          <div class="flex-grow-0 pl-2">
            <PatientrecordsManageMenu
              :show-pv-sync="showPvSync"
              :show-radar-sync="showRadarSync"
              :item="item"
              @deleted="$emit('deleted')"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Collapsible details -->
    <div v-show="showDetail" class="px-4 sm:px-6 mb-4">
      <PatientrecordsDetailCards :record="item" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGenderCharacter } from '@/helpers/utils/codeUtils'
import { PatientRecordSummary } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecordSummary,
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
  },
  setup() {
    const showDetail = ref(false)
    return { showDetail, formatDate, formatGenderCharacter }
  },
})
</script>
