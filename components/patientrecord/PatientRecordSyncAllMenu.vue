<template>
  <div v-if="buttonAvailable">
    <BaseButtonMini
      label="Manage record"
      class="z-0 mr-2 flex gap-1"
      :tooltip="!hasPkbMembership ? 'Patient does not have a PKB membership record' : undefined"
      :class="{ 'btn-disabled': !hasPkbMembership || syncInProgress }"
      @click="exportAllToPKB"
    >
      <IconCloudArrowUp class="inline text-gray-800" />
      Sync to PKB
    </BaseButtonMini>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import IconCloudArrowUp from "~/components/icons/hero/20/solid/IconCloudArrowUp.vue";
import usePermissions from "~/composables/usePermissions";
import useRecordExport from "~/composables/useRecordExport";

export default defineComponent({
  components: {
    BaseButtonMini,
    IconCloudArrowUp,
  },
  props: {
    records: {
      type: Array as () => PatientRecordSummarySchema[],
      required: true,
    },
    hasPkbMembership: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { $toast } = useContext();
    const { hasPermission } = usePermissions();
    const { exportPKB } = useRecordExport();

    // Data refs
    const buttonAvailable = computed(() => {
      return hasPermission("ukrdc:records:export");
    });

    const syncInProgress = ref(false);

    // Sync functionality
    function exportAllToPKB() {
      syncInProgress.value = true;
      for (const record of props.records) {
        const itemKey = `${record.sendingfacility}/${record.sendingextract}`;
        exportPKB(record)
          .then(() => {
            $toast.show({
              type: "success",
              title: `Sync ${itemKey} Finished`,
              message: `Export of ${itemKey} completed successfully`,
              timeout: 10,
              classTimeout: "bg-blue-600",
            });
          })
          .catch((e) => {
            $toast.show({
              type: "danger",
              title: `Sync ${itemKey} Failed`,
              message: e.message,
              timeout: 10,
              classTimeout: "bg-red-600",
            });
          })
          .finally(() => {
            syncInProgress.value = false;
          });
      }
    }

    return {
      buttonAvailable,
      syncInProgress,
      exportAllToPKB,
    };
  },
});
</script>
