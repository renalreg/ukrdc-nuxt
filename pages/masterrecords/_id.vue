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
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { MasterRecord } from '@/interfaces/masterrecord'
import { WorkItem } from '@/interfaces/workitem'
import { PatientRecordShort } from '@/interfaces/patientrecord'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      record: {} as MasterRecord,
      relatedRecords: [] as MasterRecord[],
      workItems: [] as WorkItem[],
      patientRecords: [] as PatientRecordShort[],
    }
  },
  async fetch() {
    // Get the main record data
    const path = `${this.$config.apiBase}/empi/masterrecords/${this.$route.params.id}/`
    const res: MasterRecord = await this.$axios.$get(path)
    this.record = res

    // Use the record links to load related data concurrently
    const [relatedRecords, workItems, patientRecords] = await Promise.all([
      this.$axios.$get(this.record.links.related),
      this.$hasPermission('ukrdc:empi:write')
        ? this.$axios.$get(this.record.links.workitems)
        : null,
      this.$axios.$get(this.record.links.patientrecords),
    ])

    this.relatedRecords = relatedRecords
    this.workItems = workItems
    this.patientRecords = patientRecords
  },
  head() {
    return {
      title: 'Master Records',
    }
  },
})
</script>

<style></style>
