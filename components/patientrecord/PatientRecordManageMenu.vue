<template>
  <div>
    <PatientRecordDeleteModal ref="deleteModal" :item="item" @deleted="$emit('deleted')" />
    <div v-click-away="closeMenu" class="relative flex h-full items-center justify-self-end">
      <BaseButtonSlot
        label="Manage record"
        class="z-0 flex h-full items-center hover:bg-gray-50"
        @click="showMenu = !showMenu"
      >
        <IconEllipsisVertical class="mx-1 text-gray-600 hover:text-gray-800" />
      </BaseButtonSlot>

      <BaseMenu class="right-0 top-0 z-10 mx-2 my-2" :show="showMenu">
        <BaseMenuItem @click="copyPID"> Copy PID </BaseMenuItem>
        <div v-if="hasPermission('ukrdc:records:export') && (showPvSync || showRadarSync || showPkbSync)">
          <BaseMenuDivider />
          <BaseMenuItem v-if="showPvSync" @click="exportPVandCloseMenu"> Sync Record to PatientView </BaseMenuItem>
          <BaseMenuItem v-if="showRadarSync" @click="exportRADARandCloseMenu"> Sync Record to RADAR </BaseMenuItem>
          <BaseMenuItem v-if="showPkbSync" @click="exportPKBandCloseMenu"> Sync Record to PKB </BaseMenuItem>
        </div>
        <div v-if="hasPermission('ukrdc:records:write')">
          <BaseMenuDivider />
          <BaseMenuItem
            :disabled="!demographicsUpdatable"
            :tooltip="
              demographicsUpdatable ? undefined : 'Demographics cannot be directly modified for this record type'
            "
            @click="$router.push(`/patientrecords/${item.pid}/update/demographics`)"
          >
            Edit Demographics
          </BaseMenuItem>
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
import { computed, defineComponent, ref, useContext } from "@nuxtjs/composition-api";
import { PatientRecordSummarySchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonSlot from "~/components/base/BaseButtonSlot.vue";
import BaseMenu from "~/components/base/BaseMenu.vue";
import BaseMenuDivider from "~/components/base/BaseMenuDivider.vue";
import BaseMenuItem from "~/components/base/BaseMenuItem.vue";
import IconEllipsisVertical from "~/components/icons/hero/24/solid/IconEllipsisVertical.vue";
import PatientRecordDeleteModal from "~/components/patientrecord/PatientRecordDeleteModal.vue";
import usePermissions from "~/composables/usePermissions";
import useRecordExport from "~/composables/useRecordExport";
import { demographicsUpdateAllowed } from "~/helpers/recordUtils";
import { ModalInterface } from "~/interfaces/modal";

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
    const { exportPV, exportRADAR, exportPKB } = useRecordExport();

    const deleteModal = ref<ModalInterface>();

    const showMenu = ref(false);

    const demographicsUpdatable = computed<Boolean>(() => {
      return demographicsUpdateAllowed(props.item);
    });

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

    function showDeleteModal() {
      closeMenu();
      deleteModal.value?.show();
    }

    function showExportSuccessToast() {
      // Notify of task finished
      $toast.show({
        type: "success",
        title: "Sync Finished",
        message: "Sync completed successfully",
        timeout: 10,
        classTimeout: "bg-blue-600",
      });
    }

    function showExportErrorToast(e: Error) {
      // Notify of task error
      $toast.show({
        type: "danger",
        title: "Sync Failed",
        message: e.message,
        timeout: 10,
        classTimeout: "bg-red-600",
      });
    }

    function exportPVandCloseMenu() {
      exportPV(props.item)
        .then(() => {
          showExportSuccessToast();
        })
        .catch((e) => {
          showExportErrorToast(e);
        })
        .finally(() => {
          closeMenu();
        });
    }

    function exportRADARandCloseMenu() {
      exportRADAR(props.item)
        .then(() => {
          showExportSuccessToast();
        })
        .catch((e) => {
          showExportErrorToast(e);
        })
        .finally(() => {
          closeMenu();
        });
    }

    function exportPKBandCloseMenu() {
      exportPKB(props.item)
        .then(() => {
          showExportSuccessToast();
        })
        .catch((e) => {
          showExportErrorToast(e);
        })
        .finally(() => {
          closeMenu();
        });
    }

    return {
      deleteModal,
      showMenu,
      demographicsUpdatable,
      closeMenu,
      copyPID,
      showDeleteModal,
      hasPermission,
      exportPVandCloseMenu,
      exportRADARandCloseMenu,
      exportPKBandCloseMenu,
    };
  },
});
</script>
