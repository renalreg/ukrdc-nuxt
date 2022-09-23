<template>
  <div>
    <!-- Description list -->
    <BaseCard class="my-4 p-6">
      <GenericDlGrid>
        <GenericDlGridItem>
          <TextDt>Local ID</TextDt>
          <TextDd class="sensitive">
            {{ record.localpatientid }}
          </TextDd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <TextDt>UKRDC ID</TextDt>
          <TextDd class="sensitive">{{ record.ukrdcid }}</TextDd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <TextDt>PID</TextDt>
          <TextDd class="sensitive">{{ record.pid }}</TextDd>
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
    </BaseCard>

    <PatientrecordsDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
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
