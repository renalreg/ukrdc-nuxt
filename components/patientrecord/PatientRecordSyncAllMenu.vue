<template>
  <div v-if="buttonAvailable">
    <BaseModalSuccess ref="startSyncSuccessModal" title="Started Syncing to PKB" confirm-label="Go back to records">
      <p class="mb-4"><b>This usually takes a few minutes</b></p>
      <p>We're syncing data to PKB in the background.</p>
      <p>Depending on the size of the records, this may take up to an hour.</p>
    </BaseModalSuccess>

    <BaseModalSuccess
      ref="startSyncFailureModal"
      title="Failure Syncing to PKB"
      confirm-label="Go back to records"
      :danger="true"
    >
      <p>
        Please use the
        <a
          class="font-medium text-indigo-600 hover:text-indigo-500"
          href="https://renalregistry.atlassian.net/servicedesk/customer/portals"
          target="blank"
          >UK Kidney Association Help Center</a
        >
        if this issue persists.
      </p>
      <p>Please copy the following debug information into your request:</p>
      <p class="mt-3 font-mono">exportAllToPKB.fail {{ failedPIDs }}</p>
    </BaseModalSuccess>

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
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseModalSuccess from "~/components/base/BaseModalSuccess.vue";
import IconCloudArrowUp from "~/components/icons/hero/20/solid/IconCloudArrowUp.vue";
import usePermissions from "~/composables/usePermissions";
import useRecordExport from "~/composables/useRecordExport";
import { ModalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseModalSuccess,
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
    const { hasPermission } = usePermissions();
    const { exportPKB } = useRecordExport();

    // Modals
    const startSyncSuccessModal = ref<ModalInterface>();
    const startSyncFailureModal = ref<ModalInterface>();

    // Data refs
    const buttonAvailable = computed(() => {
      return hasPermission("ukrdc:records:export");
    });

    const syncInProgress = ref(false);
    const failedPIDs = ref<string[]>([]);

    // Sync functionality
    function exportAllToPKB() {
      // Do nothing if sync is already in progress or button is disabled
      if (!props.hasPkbMembership || syncInProgress.value) {
        return;
      }

      syncInProgress.value = true;

      // Create a set of promises, one for each record we're syncing
      const promises = props.records.map((record) => {
        return exportPKB(record)
          .then(() => {
            // Handle individual success if needed
          })
          .catch(() => {
            // Append failed PID
            failedPIDs.value.push(record.pid);
          });
      });

      // Execute all promises, and show an error modal if any fail, or success if all succeed
      Promise.allSettled(promises)
        .then(() => {
          if (failedPIDs.value.length === 0) {
            startSyncSuccessModal.value?.show();
          } else {
            startSyncFailureModal.value?.show();
          }
        })
        .finally(() => {
          // Uncomment the line below if you want to re-enable the Sync All button after the operation completes
          // syncInProgress.value = false;
        });
    }

    return {
      startSyncSuccessModal,
      startSyncFailureModal,
      buttonAvailable,
      syncInProgress,
      failedPIDs,
      exportAllToPKB,
    };
  },
});
</script>
