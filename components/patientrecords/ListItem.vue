<template>
  <li>
    <div class="min-w-0 flex items-center gap-2">
      <div class="flex-1 pl-4 py-4 sm:pl-6 min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
        <!-- Name, DoB, gender -->
        <div>
          <LinkSendingFacility class="font-medium" :code="item.sendingfacility" />
          <TextP class="mt-2"> via {{ item.sendingextract }} </TextP>
        </div>
        <!-- National ID -->
        <div>
          <TextNameL1 :forename="item.patient.names[0].given" :surname="item.patient.names[0].family" />
          <TextP class="mt-2 flex items-center">
            {{ formatDate(item.patient.birthTime, (t = false)) }}
            <b class="ml-1"> {{ formatGenderCharacter(item.patient.gender) }}</b>
          </TextP>
        </div>
        <!-- MRN (medium breakpoint only) -->
        <div class="hidden sm:block">
          <TextL1 class="truncate">{{ firstMRNObject.label }} Number</TextL1>
          <TextP class="mt-2 truncate">
            {{ firstMRNObject.number }}
          </TextP>
        </div>
        <!-- UKRDC ID (large breakpoint only) -->
        <div class="hidden lg:block">
          <TextL1>UKRDC ID</TextL1>
          <TextP class="mt-2">
            {{ item.ukrdcid }}
          </TextP>
        </div>
      </div>
      <!-- Record links -->
      <div class="flex-shrink-0 flex items-center gap-2 pr-2">
        <div class="flex flex-grow flex-col-reverse xl:flex-row gap-2">
          <GenericButtonMini class="h-8 truncate" @click="showDetail = !showDetail">
            {{ showDetail ? 'Hide Record' : 'Peek Record' }}
          </GenericButtonMini>
          <GenericButtonMini :to="`/patientrecords/${item.pid}`" class="h-8 truncate"> Open Record </GenericButtonMini>
        </div>
        <div class="flex-grow-0">
          <PatientrecordsManageMenu
            :show-pv-sync="showPvSync"
            :show-radar-sync="showRadarSync"
            :item="item"
            @deleted="$emit('deleted')"
          />
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
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGenderCharacter } from '@/helpers/utils/codeUtils'
import { PatientRecordSummary } from '@/interfaces/patientrecord'
import { firstMRN } from '~/helpers/utils/recordUtils'

interface localNumber {
  label: string
  number: string
}

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
  setup(props) {
    const showDetail = ref(false)

    const firstMRNObject = computed<localNumber>(() => {
      return firstMRN(props.item)
    })

    return { showDetail, formatDate, formatGenderCharacter, firstMRNObject }
  },
})
</script>
