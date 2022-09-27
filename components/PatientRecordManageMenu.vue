<template>
  <div>
    <PatientRecordDeleteModal ref="deleteModal" :item="item" @deleted="$emit('deleted')" />
    <div v-click-away="closeMenu" class="relative flex items-center justify-self-end">
      <BaseButtonSlot label="Manage record" class="z-0" @click="showMenu = !showMenu">
        <IconEllipsisVertical class="text-gray-600 hover:text-gray-800" />
      </BaseButtonSlot>

      <BaseMenu class="top-0 right-0 z-10 mx-2 my-2" :show="showMenu">
        <BaseMenuItem @click="copyPID"> Copy PID </BaseMenuItem>
        <div v-if="hasPermission('ukrdc:records:export') && (showPvSync || showRadarSync || showPkbSync)">
          <BaseMenuDivider />
          <BaseMenuItem v-if="showPvSync" @click="exportPV"> Sync Record to PatientView </BaseMenuItem>
          <BaseMenuItem v-if="showPvSync" @click="exportPVDocs"> Sync Docs to PatientView </BaseMenuItem>
          <BaseMenuItem v-if="showPvSync" @click="exportPVTests"> Sync Tests to PatientView </BaseMenuItem>
          <BaseMenuItem v-if="showRadarSync" @click="exportRADAR"> Sync Record to RADAR </BaseMenuItem>
          <BaseMenuItem v-if="showPkbSync" @click="exportPKB"> Sync Record to PKB </BaseMenuItem>
        </div>
        <div v-if="hasPermission('ukrdc:records:delete')">
          <BaseMenuDivider />
          <BaseMenuItem @click="showDeleteModal"> Delete Record </BaseMenuItem>
        </div>
      </BaseMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema, TrackableTaskSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonSlot from "~/components/base/BaseButtonSlot.vue";
import BaseMenu from "~/components/base/BaseMenu.vue";
import BaseMenuDivider from "~/components/base/BaseMenuDivider.vue";
import BaseMenuItem from "~/components/base/BaseMenuItem.vue";
import IconEllipsisVertical from "~/components/icons/hero/24/solid/IconEllipsisVertical.vue";
import PatientRecordDeleteModal from "~/components/PatientRecordDeleteModal.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import useTasks from "~/composables/useTasks";
import { modalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseButtonSlot,
    BaseMenu,
    BaseMenuDivider,
    BaseMenuItem,
    IconEllipsisVertical,
    PatientRecordDeleteModal,
  },
  props: {
    item: {
      type: Object as () => PatientRecordSummarySchema,
      required: true,
    },
    showPvSync: {
      type: Boolean,
      required: false,
      default: false,
    },
    showRadarSync: {
      type: Boolean,
      required: false,
      default: false,
    },
    showPkbSync: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { $toast } = useContext();
    const { hasPermission } = usePermissions();
    const { patientRecordsApi } = useApi();
    const { pollTask } = useTasks();

    const deleteModal = ref<modalInterface>();

    const showMenu = ref(false);

    function closeMenu() {
      showMenu.value = false;
    }

    function copyPID() {
      navigator.clipboard
        .writeText(props.item.pid)
        .then(() => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "PID copied to clipboard",
            timeout: 5,
            classTimeout: "bg-green-600",
          });
        })
        .finally(() => {
          closeMenu();
        });
    }

    function showExportStartedToast() {
      $toast.show({
        type: "info",
        title: "Export Started",
        message: "Export is now running in the background",
        timeout: 5,
        classTimeout: "bg-green-600",
      });
    }

    function showExportSuccessToast() {
      // Notify of task finished
      $toast.show({
        type: "success",
        title: "Export Finished",
        message: "Export completed successfully",
        timeout: 10,
        classTimeout: "bg-blue-600",
      });
    }

    function showExportErrorToast() {
      // Notify of task finished
      $toast.show({
        type: "error",
        title: "Export Failed",
        message: "Export failed",
        timeout: 10,
        classTimeout: "bg-red-600",
      });
    }

    function exportPV() {
      patientRecordsApi
        .postPatientExportPv({ pid: props.item.pid })
        .then((response) => {
          const task: TrackableTaskSchema = response.data;
          showExportStartedToast();
          pollTask(task, 1)
            .then(() => {
              showExportSuccessToast();
            })
            .catch(() => {
              showExportErrorToast();
            });
        })
        .finally(() => {
          closeMenu();
        });
    }

    function exportPVDocs() {
      patientRecordsApi
        .postPatientExportPvDocs({ pid: props.item.pid })
        .then((response) => {
          const task: TrackableTaskSchema = response.data;
          showExportStartedToast();
          pollTask(task, 1)
            .then(() => {
              showExportSuccessToast();
            })
            .catch(() => {
              showExportErrorToast();
            });
        })
        .finally(() => {
          closeMenu();
        });
    }

    function exportPVTests() {
      patientRecordsApi
        .postPatientExportPvTests({ pid: props.item.pid })
        .then((response) => {
          const task: TrackableTaskSchema = response.data;
          showExportStartedToast();
          pollTask(task, 1)
            .then(() => {
              showExportSuccessToast();
            })
            .catch(() => {
              showExportErrorToast();
            });
        })
        .finally(() => {
          closeMenu();
        });
    }

    function exportRADAR() {
      patientRecordsApi
        .postPatientExportRadar({ pid: props.item.pid })
        .then((response) => {
          const task: TrackableTaskSchema = response.data;
          showExportStartedToast();
          pollTask(task, 1)
            .then(() => {
              showExportSuccessToast();
            })
            .catch(() => {
              showExportErrorToast();
            });
        })
        .finally(() => {
          closeMenu();
        });
    }

    function exportPKB() {
      patientRecordsApi
        .postPatientExportPkb({ pid: props.item.pid })
        .then((response) => {
          const task: TrackableTaskSchema = response.data;
          showExportStartedToast();
          pollTask(task, 1)
            .then(() => {
              showExportSuccessToast();
            })
            .catch(() => {
              showExportErrorToast();
            });
        })
        .finally(() => {
          closeMenu();
        });
    }

    function showDeleteModal() {
      closeMenu();
      deleteModal.value?.show();
    }

    return {
      deleteModal,
      showMenu,
      closeMenu,
      copyPID,
      showDeleteModal,
      hasPermission,
      exportPV,
      exportPVDocs,
      exportPVTests,
      exportRADAR,
      exportPKB,
    };
  },
});
</script>
