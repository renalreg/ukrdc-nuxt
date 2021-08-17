<template>
  <div>
    <div v-if="record && record.patient" class="md:flex items-center mb-2">
      <div class="flex-grow">
        <TextH1>{{ fullName }}</TextH1>
        <TextL1> PID {{ $route.params.pid }} </TextL1>
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
import {
  defineComponent,
  ref,
  useFetch,
  useRoute,
  useContext,
  computed,
  watch,
  useRouter,
  useMeta,
} from '@nuxtjs/composition-api'

import { PatientRecord } from '@/interfaces/patientrecord'
import { TabItem } from '@/interfaces/tabs'

import { isMembership } from '@/utilities/recordUtils'

import usePermissions from '~/mixins/usePermissions'

export default defineComponent({
  fetchOnServer: false,

  setup() {
    const route = useRoute()
    const router = useRouter()
    const { $axios, $config } = useContext()
    const { hasPermission } = usePermissions()

    // Head
    const { title } = useMeta()
    title.value = `Record ${route.value.params.pid}`

    const record = ref<PatientRecord>()
    const related = ref<PatientRecord[]>()
    const relatedDataRecords = computed<PatientRecord[]>(() => {
      if (related.value) {
        return related.value.filter((record) => !isMembership(record))
      }
      return []
    })

    const fullName = computed(() => {
      if (record) {
        return `${record.value?.patient.names[0].given} ${record.value?.patient.names[0].family}`
      } else {
        return ''
      }
    })

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

    useFetch(async () => {
      const path = `${$config.apiBase}/v1/patientrecords/${route.value.params.pid}/`

      const res: PatientRecord = await $axios.$get(path)
      record.value = res

      // Update title
      title.value = `${fullName.value} from ${record.value.sendingfacility}`

      const rel: PatientRecord[] = await $axios.$get(`${path}related/`)
      related.value = rel
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
