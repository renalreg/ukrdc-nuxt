<template>
  <div>
    <PatientRecordDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";
import PatientRecordDetailCards from "~/components/PatientRecordDetailCards.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    BaseCard,
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
    PatientRecordDetailCards,
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
