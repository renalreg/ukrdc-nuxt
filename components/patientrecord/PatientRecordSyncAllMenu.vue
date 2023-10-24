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
      // Do nothing if sync is already in progress
      if (syncInProgress.value) {
        return;
      }

      syncInProgress.value = true;
      for (const record of props.records) {
        const itemKey = `${record.sendingfacility}/${record.sendingextract}`;
        exportPKB(record)
          .then(() => {
            $toast.show({
              type: "success",
              title: `Started Syncing ${itemKey} to PKB`,
              message: `This may take a few minutes depending on the size of the record.`,
              timeout: 10,
              classTimeout: "hidden",
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
            // Note: Uncomment this line if you want to re-enable the Sync All button after
            // already clicking it once.
            // We found that some users repeatedly clicked it, adding load to the system, so
            // as a minor discouragement, that now requires reloading the page.
            // syncInProgress.value = false;
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
