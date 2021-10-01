<template>
  <div>
    <!-- Description list -->
    <GenericCard class="my-8 p-6">
      <GenericDl>
        <GenericDi>
          <TextDt>Local ID</TextDt>
          <TextDd>
            {{ record.localpatientid }}
          </TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>UKRDC ID</TextDt>
          <TextDd>{{ record.ukrdcid }}</TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>PID</TextDt>
          <TextDd>{{ record.pid }}</TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>Last Updated</TextDt>
          <TextDd>
            {{ formatDate(record.repositoryUpdateDate) }}
          </TextDd>
        </GenericDi>

        <GenericDi>
          <TextDt>Created</TextDt>
          <TextDd>
            {{ formatDate(record.repositoryCreationDate) }}
          </TextDd>
        </GenericDi>
      </GenericDl>
    </GenericCard>

    <PatientrecordsDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { formatDate } from '@/helpers/utils/dateUtils'
import { formatGender } from '@/helpers/utils/codeUtils'
import { isEmptyObject } from '@/helpers/utils/objectUtils'

import { PatientRecord } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    record: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },

  setup() {
    return {
      formatDate,
      formatGender,
      isEmptyObject,
    }
  },
})
</script>
