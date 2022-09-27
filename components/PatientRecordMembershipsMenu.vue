<template>
  <div>
    <BaseModalConfirm
      ref="createPkbMembershipConfirm"
      title="Create PKB Membership"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="false"
      @confirm="createPkbMembership()"
    >
      <p class="mb-2">Are you sure you want to create a PKB membership for this patient?</p>
      <p>
        Data will only be sent to PKB if/when at least one of the patient's renal units enrolls in PKB data sending.
      </p>
    </BaseModalConfirm>

    <div v-click-away="closeMenu" class="relative flex items-center justify-self-end">
      <BaseButtonMini
        label="Manage record"
        class="z-0 mr-2 flex gap-1"
        :tooltip="!menuAvailable ? 'You do not have permission to manage patient memberships' : undefined"
        :class="{ 'btn-disabled': !menuAvailable }"
        @click="showMenu = !showMenu"
      >
        <IconPlus class="inline text-gray-800" />
        Add Memberships
      </BaseButtonMini>

      <BaseMenu class="top-8 right-2 z-10 ml-2" :show="menuAvailable && showMenu">
        <BaseMenuItem v-if="showCreatePkbMembership" @click="showCreatePkbMembershipConfirm">
          Create PKB Membership
        </BaseMenuItem>
        <BaseMenuItem v-else :disabled="true"> PKB membership already exists </BaseMenuItem>
      </BaseMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext } from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseMenu from "~/components/base/BaseMenu.vue";
import BaseMenuItem from "~/components/base/BaseMenuItem.vue";
import BaseModalConfirm from "~/components/base/BaseModalConfirm.vue";
import IconPlus from "~/components/icons/hero/20/solid/IconPlus.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import { modalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseMenu,
    BaseMenuItem,
    BaseModalConfirm,
    IconPlus,
  },
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
  setup(props, { emit }) {
    const { $toast } = useContext();
    const { hasPermission } = usePermissions();
    const { masterRecordsApi } = useApi();

    // Modals

    const createPkbMembershipConfirm = ref<modalInterface>();

    // Data refs

    const showMenu = ref(false);
    const menuAvailable = computed(() => {
      return hasPermission("ukrdc:memberships:create");
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
          emit("refresh");
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
    };
  },
});
</script>
