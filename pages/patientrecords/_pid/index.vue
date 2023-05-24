<template>
  <div>
    <PatientRecordDetailCards :full="true" :record="record" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { PatientRecordSchema, PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import PatientRecordDetailCards from "~/components/patientrecord/PatientRecordPeek.vue";
import useApi from "~/composables/useApi";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";

export default defineComponent({
  components: {
    PatientRecordDetailCards,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },

  setup(props) {
    const { ukrdcRecordGroupApi } = useApi();

    // Data refs
    const related = ref<PatientRecordSummarySchema[]>();

    // Data fetching

    function getRelated() {
      ukrdcRecordGroupApi
        .getUkrdcidRecords({
          ukrdcid: props.record.ukrdcid,
        })
        .then((response) => {
          related.value = response.data;
        });
    }

    onMounted(() => {
      getRelated();
    });

    return {
      related,
      formatDate,
      formatGender,
      isEmptyObject,
    };
  },
});
</script>
