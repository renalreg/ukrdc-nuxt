<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <div v-if="record" class="mb-6">
      <TextH1 v-if="record.givenname" class="capitalize">
        {{ record.givenname.toLowerCase() }}
        {{ record.surname.toLowerCase() }}
      </TextH1>
      <TextL1> {{ record.nationalidType }} record </TextL1>
    </div>

    <!-- Work items alert -->
    <GenericAlertWarning
      class="mb-4"
      :message="`${workItems.length} open workitem(s) found`"
    />

    <!-- Description list -->
    <GenericCard>
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt class="text-sm font-medium text-gray-500"
              >National ID</TextDt
            >
            <TextDd>{{ record.nationalid }}</TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>ID Type</TextDt>
            <TextDd>{{ record.nationalidType }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Gender</TextDt>
            <TextDd>{{ formatGender(record.gender) }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Date of Birth</TextDt>
            <TextDd>{{ formatDate(record.dateOfBirth, (t = false)) }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Last Updated</TextDt>
            <TextDd>{{ formatDate(record.lastUpdated) }} </TextDd>
          </GenericDi>

          <GenericDi>
            <TextDt>Effective Date</TextDt>
            <TextDd>{{ formatDate(record.effectiveDate) }} </TextDd>
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <GenericCard v-if="workItems && workItems.length > 0" class="mt-4">
      <GenericCardHeader>
        <TextH2> Open Work Items </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <workitemsListItem
          v-for="item in workItems"
          :key="item.id"
          :item="item"
        />
      </ul>
    </GenericCard>

    <!-- Related Patient Records card -->
    <GenericCard class="mt-4">
      <GenericCardHeader>
        <TextH2> Patient Records </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <patientrecordsListItem
          v-for="item in patientRecords"
          :key="item.pid"
          :item="item"
        />
      </ul>
    </GenericCard>

    <!-- Related Master Records card -->
    <GenericCard class="mt-4">
      <GenericCardHeader>
        <TextH2> Linked Master Records </TextH2>
      </GenericCardHeader>
      <ul class="divide-y divide-gray-200">
        <masterrecordsListItem
          v-for="item in relatedRecords"
          :key="item.id"
          :item="item"
        />
      </ul>
    </GenericCard>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  useFetch,
  useContext,
} from '@nuxtjs/composition-api'

import { formatDate } from '@/utilities/dateUtils'
import { formatGender } from '@/utilities/codeUtils'

import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'
import { PatientRecordShort } from '@/interfaces/patientrecord'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config, $hasPermission } = useContext()

    const record = ref({} as MasterRecord)
    const relatedRecords = ref([] as MasterRecord[])
    const workItems = ref([] as WorkItem[])
    const patientRecords = ref([] as PatientRecordShort[])

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/empi/masterrecords/${route.value.params.id}/`
      const res: MasterRecord = await $axios.$get(path)
      record.value = res

      // Use the record links to load related data concurrently
      const [
        relatedRecordsResponse,
        workItemsResponse,
        patientRecordsResponse,
      ] = await Promise.all([
        $axios.$get(record.value.links.related),
        $hasPermission('ukrdc:empi:write')
          ? $axios.$get(record.value.links.workitems)
          : null,
        $axios.$get(record.value.links.patientrecords),
      ])

      relatedRecords.value = relatedRecordsResponse
      workItems.value = workItemsResponse
      patientRecords.value = patientRecordsResponse
    })

    return {
      record,
      workItems,
      patientRecords,
      relatedRecords,
      formatGender,
      formatDate,
    }
  },
  head: {
    title: 'Master Records',
  },
})
</script>

<style></style>
