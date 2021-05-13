<template>
  <div>
    <div v-if="record.patient" class="mb-2">
      <TextH1>
        {{ record.patient.names[0].given }} {{ record.patient.names[0].family }}
      </TextH1>
      <TextL1>
        From {{ record.sendingfacility }} via {{ record.sendingextract }}
      </TextL1>
    </div>

    <div class="mb-6"><GenericNavigationTabsLine :tabs="tabs" /></div>

    <NuxtChild :record="record" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useFetch,
  useRoute,
  useContext,
  computed,
} from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { TabItem } from '@/interfaces/tabs'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config, $hasPermission } = useContext()

    const record = ref({} as PatientRecord)
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
        name: 'Lab Orders',
        href: `/patientrecords/${route.value.params.pid}/laborders`,
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
        ...($hasPermission('ukrdc:mirth:write')
          ? [
              {
                name: 'Export',
                href: `/patientrecords/${route.value.params.pid}/export`,
              },
            ]
          : []),
      ]
    })

    useFetch(async () => {
      const path = `${$config.apiBase}/patientrecords/${route.value.params.pid}/`
      const res: PatientRecord = await $axios.$get(path)
      record.value = res
    })

    return {
      record,
      tabs,
    }
  },
  head: {
    title: 'Patient Record',
  },
})
</script>
