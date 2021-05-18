<template>
  <div>
    <div v-if="record && record.patient" class="md:flex items-center mb-2">
      <div class="flex-grow">
        <TextH1>
          {{ record.patient.names[0].given }}
          {{ record.patient.names[0].family }}
        </TextH1>
      </div>
      <div v-if="related">
        <GenericSelect v-model="selectedPid">
          <option
            v-for="(item, index) in related"
            :key="index"
            :value="item.pid"
          >
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
import {
  defineComponent,
  ref,
  useFetch,
  useRoute,
  useContext,
  computed,
  watch,
  useRouter,
} from '@nuxtjs/composition-api'

import { PatientRecord, PatientRecordShort } from '@/interfaces/patientrecord'
import { TabItem } from '@/interfaces/tabs'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { $axios, $config, $hasPermission } = useContext()

    const record = ref<PatientRecord>()
    const related = ref<PatientRecordShort[]>()

    const selectedPid = ref(route.value.params.pid)
    watch(selectedPid, (value: string) => {
      router.push({ name: route.value.name!, params: { pid: value } })
    })

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
      const rel: PatientRecordShort[] = await $axios.$get(`${path}related`)
      related.value = rel
    })

    return {
      record,
      related,
      selectedPid,
      tabs,
    }
  },
  head: {
    title: 'Patient Record',
  },
})
</script>
