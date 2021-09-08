<template>
  <div>
    <div v-if="record && record.patient" class="md:flex items-center mb-2">
      <div class="flex-grow">
        <TextH1>{{ fullName }}</TextH1>
      </div>
      <div v-if="related">
        <GenericSelect v-model="selectedPid">
          <option v-for="(item, index) in relatedDataRecords" :key="index" :value="item.pid">
            From {{ item.sendingfacility }} via {{ item.sendingextract }}
          </option>
        </GenericSelect>
      </div>
    </div>

    <div class="mb-6"><GenericNavigationTabsLine :tabs="tabs" /></div>

    <NuxtChild v-if="record" :record="record" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useMeta, useRoute, useRouter, watch } from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { TabItem } from '@/interfaces/tabs'

import { isMembership } from '@/helpers/utils/recordUtils'
import fetchPatientRecords from '~/helpers/fetch/fetchPatientRecords'

import usePermissions from '~/helpers/usePermissions'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { hasPermission } = usePermissions()
    const { fetchPatientRecord, fetchPatientRecordRelated } = fetchPatientRecords()

    // Head
    const { title } = useMeta()
    title.value = `Record ${route.value.params.pid}`

    // Data refs

    const record = ref<PatientRecord>()
    const related = ref<PatientRecord[]>()

    // Data fetching

    async function getRecord() {
      record.value = await fetchPatientRecord(route.value.params.pid)
      related.value = await fetchPatientRecordRelated(record.value)

      // Update title
      title.value = `${fullName.value} from ${record.value.sendingfacility}`
    }

    onMounted(() => {
      getRecord()
    })

    // PID Switcher UI

    const relatedDataRecords = computed<PatientRecord[]>(() => {
      if (related.value) {
        return related.value.filter((record) => !isMembership(record))
      }
      return []
    })

    const selectedPid = ref(route.value.params.pid)

    watch(selectedPid, (value: string) => {
      router.push({ name: route.value.name!, params: { pid: value } })
    })

    // Dynamic UI elements

    const fullName = computed(() => {
      if (record) {
        return `${record.value?.patient.names[0].given} ${record.value?.patient.names[0].family}`
      } else {
        return ''
      }
    })

    // Navigation

    const baseTabs = [
      {
        name: 'Overview',
        href: `/patientrecords/${route.value.params.pid}`,
      },
      {
        name: 'Medications',
        href: `/patientrecords/${route.value.params.pid}/medications`,
      },
      {
        name: 'Treatments',
        href: `/patientrecords/${route.value.params.pid}/treatments`,
      },
      {
        name: 'Results',
        href: `/patientrecords/${route.value.params.pid}/results`,
      },
      {
        name: 'Observations',
        href: `/patientrecords/${route.value.params.pid}/observations`,
      },
      {
        name: 'Surveys',
        href: `/patientrecords/${route.value.params.pid}/surveys`,
      },
    ] as TabItem[]

    const tabs = computed(() => {
      return [
        ...baseTabs,
        ...(hasPermission('ukrdc:mirth:write')
          ? [
              {
                name: 'Export',
                href: `/patientrecords/${route.value.params.pid}/export`,
              },
            ]
          : []),
      ]
    })

    return {
      record,
      related,
      relatedDataRecords,
      selectedPid,
      fullName,
      tabs,
    }
  },
  head: {
    title: 'Patient Record',
  },
})
</script>
