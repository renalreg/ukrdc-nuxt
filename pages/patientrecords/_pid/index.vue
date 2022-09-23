<template>
  <div>
    <!-- Description list -->
    <BaseCard class="my-4 p-6">
      <BaseDlGrid>
        <BaseDlGridItem>
          <dt>Local ID</dt>
          <dd class="sensitive">
            {{ record.localpatientid }}
          </dd>
        </BaseDlGridItem>

        <BaseDlGridItem>
          <dt>UKRDC ID</dt>
          <dd class="sensitive">{{ record.ukrdcid }}</dd>
        </BaseDlGridItem>

        <BaseDlGridItem>
          <dt>PID</dt>
          <dd class="sensitive">{{ record.pid }}</dd>
        </BaseDlGridItem>

        <BaseDlGridItem>
          <dt>Last Updated</dt>
          <dd>
            {{ formatDate(record.repositoryUpdateDate) }}
          </dd>
        </BaseDlGridItem>

        <BaseDlGridItem>
          <dt>Created</dt>
          <dd>
            {{ formatDate(record.repositoryCreationDate) }}
          </dd>
        </BaseDlGridItem>
      </BaseDlGrid>
    </BaseCard>

    <PatientrecordsDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseDlGrid from "~/components/base/BaseDlGrid.vue";
import BaseDlGridItem from "~/components/base/BaseDlGridItem.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseDlGrid,
    BaseDlGridItem,
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
