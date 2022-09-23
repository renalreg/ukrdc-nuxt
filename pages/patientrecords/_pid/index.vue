<template>
  <div>
    <!-- Description list -->
    <BaseCard class="my-4 p-6">
      <GenericDlGrid>
        <GenericDlGridItem>
          <dt>Local ID</dt>
          <dd class="sensitive">
            {{ record.localpatientid }}
          </dd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <dt>UKRDC ID</dt>
          <dd class="sensitive">{{ record.ukrdcid }}</dd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <dt>PID</dt>
          <dd class="sensitive">{{ record.pid }}</dd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <dt>Last Updated</dt>
          <dd>
            {{ formatDate(record.repositoryUpdateDate) }}
          </dd>
        </GenericDlGridItem>

        <GenericDlGridItem>
          <dt>Created</dt>
          <dd>
            {{ formatDate(record.repositoryCreationDate) }}
          </dd>
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
