<template>
  <div>
    <!-- Description list -->
    <GenericCard class="my-4 p-6">
      <GenericDlGrid>
        <GenericDlGridItem>
          <TextDt>Local ID</TextDt>
          <TextDd class="blurred">
            {{ record.localpatientid }}
          </TextDd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <TextDt>UKRDC ID</TextDt>
          <TextDd class="blurred">{{ record.ukrdcid }}</TextDd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <TextDt>PID</TextDt>
          <TextDd class="blurred">{{ record.pid }}</TextDd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <TextDt>Last Updated</TextDt>
          <TextDd>
            {{ formatDate(record.repositoryUpdateDate) }}
          </TextDd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <TextDt>Created</TextDt>
          <TextDd>
            {{ formatDate(record.repositoryCreationDate) }}
          </TextDd>
        </GenericDlGridItem>
      </GenericDlGrid>
    </GenericCard>

    <PatientrecordsDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { formatDate } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";
import { isEmptyObject } from "@/helpers/utils/objectUtils";

import { PatientRecord } from "@/interfaces/patientrecord";

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
    };
  },
});
</script>
