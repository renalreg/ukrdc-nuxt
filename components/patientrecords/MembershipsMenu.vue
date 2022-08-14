<template>
  <div>
    <GenericModalConfirm
      ref="createPkbMembershipConfirm"
      title="Create PKB Membership"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="false"
      @confirm="createPkbMembership()"
    >
      <TextP class="mb-2">Are you sure you want to create a PKB membership for this patient?</TextP>
      <TextP>
        Data will only be sent to PKB if/when at least one of the patient's renal units enrolls in PKB data sending.
      </TextP>
    </GenericModalConfirm>

    <div v-click-away="closeMenu" class="relative flex items-center justify-self-end">
      <GenericButtonRaw :disabled="!menuAvailable" label="Manage record" class="z-0" @click="showMenu = !showMenu">
        <IconMiniPlusCircle class="text-gray-400" :class="{ 'hover:text-gray-800': menuAvailable }" />
      </GenericButtonRaw>

      <GenericMenu class="top-0 right-0 z-10 mx-2" :show="menuAvailable && showMenu">
        <GenericMenuItem v-if="showCreatePkbMembership" @click="showCreatePkbMembershipConfirm">
          Create PKB Membership
        </GenericMenuItem>
      </GenericMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import usePermissions from "~/helpers/usePermissions";

import { modalInterface } from "~/interfaces/modal";
import useApi from "~/helpers/useApi";

export default defineComponent({
  props: {
    masterRecord: {
      type: Object as () => MasterRecordSchema,
      required: true,
    },
    showCreatePkbMembership: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { $toast } = useNuxtApp();
    const { hasPermission } = usePermissions();
    const { masterRecordsApi } = useApi();

    // Modals

    const createPkbMembershipConfirm = ref<modalInterface>();

    // Data refs

    const showMenu = ref(false);
    const menuAvailable = computed(() => {
      // As we add more membership types this should be true if ANY
      // of them are available options
      return props.showCreatePkbMembership;
    });

    function closeMenu() {
      showMenu.value = false;
    }

    function showCreatePkbMembershipConfirm() {
      closeMenu();
      createPkbMembershipConfirm.value?.show();
    }

    function createPkbMembership() {
      masterRecordsApi
        .postMasterRecordMembershipsCreatePkb({
          recordId: props.masterRecord.id,
        })
        .then(() => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "PKB membership created",
            timeout: 10,
            classTimeout: "bg-green-600",
          });
        })
        .catch((error) => {
          // Notify of task error
          $toast.show({
            type: "error",
            title: "Error creating PKB membership",
            message: error.response.data.detail,
            timeout: 10,
            classTimeout: "bg-red-600",
          });
        })
        .finally(() => {
          closeMenu();
        });
    }

    return {
      showMenu,
      menuAvailable,
      closeMenu,
      createPkbMembershipConfirm,
      showCreatePkbMembershipConfirm,
      createPkbMembership,
      hasPermission,
    };
  },
});
</script>
