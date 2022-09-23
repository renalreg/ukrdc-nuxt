<template>
  <div>
    <!-- Description list -->
    <BaseCard class="my-4 p-6">
      <BaseDescriptionListGrid>
        <BaseDescriptionListGridItem>
          <dt>Local ID</dt>
          <dd class="sensitive">
            {{ record.localpatientid }}
          </dd>
        </BaseDescriptionListGridItem>

        <BaseDescriptionListGridItem>
          <dt>UKRDC ID</dt>
          <dd class="sensitive">{{ record.ukrdcid }}</dd>
        </BaseDescriptionListGridItem>

        <BaseDescriptionListGridItem>
          <dt>PID</dt>
          <dd class="sensitive">{{ record.pid }}</dd>
        </BaseDescriptionListGridItem>

        <BaseDescriptionListGridItem>
          <dt>Last Updated</dt>
          <dd>
            {{ formatDate(record.repositoryUpdateDate) }}
          </dd>
        </BaseDescriptionListGridItem>

        <BaseDescriptionListGridItem>
          <dt>Created</dt>
          <dd>
            {{ formatDate(record.repositoryCreationDate) }}
          </dd>
        </BaseDescriptionListGridItem>
      </BaseDescriptionListGrid>
    </BaseCard>

    <PatientrecordsDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
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
