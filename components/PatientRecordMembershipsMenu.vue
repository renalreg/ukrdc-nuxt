<template>
  <div>
    <BaseModalConfirm
      ref="createPkbMembershipConfirm"
      title="Create PKB Membership"
      :danger="false"
      @confirm="createPkbMembership()"
    >
      <p class="mb-2">Are you sure you want to create a PKB membership for this patient?</p>
      <p>
        Data will only be sent to PKB if/when at least one of the patient's renal units enrolls in PKB data sending.
      </p>
    </BaseModalConfirm>
    <BaseModalSuccess
      ref="createPkbMembershipSuccess"
      title="PKB Membership Created"
      confirm-label="Go back to records"
    >
      <p class="mb-4"><b>No data has been automatically sent</b></p>
      <p>To send data, click</p>
      <div class="my-1 flex items-center justify-center gap-2">
        <IconCloudArrowUp class="inline text-gray-800" /><b>Sync to PKB</b>
      </div>
      <p>from the Data Feeds section</p>
    </BaseModalSuccess>

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
import { computed, defineComponent, onMounted, ref, useContext } from "@nuxtjs/composition-api";
import { MasterRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButtonMini from "~/components/base/BaseButtonMini.vue";
import BaseMenu from "~/components/base/BaseMenu.vue";
import BaseMenuItem from "~/components/base/BaseMenuItem.vue";
import BaseModalConfirm from "~/components/base/BaseModalConfirm.vue";
import BaseModalSuccess from "~/components/base/BaseModalSuccess.vue";
import IconCloudArrowUp from "~/components/icons/hero/20/solid/IconCloudArrowUp.vue";
import IconPlus from "~/components/icons/hero/20/solid/IconPlus.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import { ModalInterface } from "~/interfaces/modal";

export default defineComponent({
  components: {
    BaseButtonMini,
    BaseMenu,
    BaseMenuItem,
    BaseModalSuccess,
    BaseModalConfirm,
    IconPlus,
    IconCloudArrowUp,
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

    const createPkbMembershipConfirm = ref<ModalInterface>();
    const createPkbMembershipSuccess = ref<ModalInterface>();

    onMounted(() => {
      createPkbMembershipSuccess.value?.show();
    });

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
          createPkbMembershipSuccess.value?.show();
        })
        .catch((error) => {
          // Notify of task error
          $toast.show({
            type: "danger",
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
      createPkbMembershipSuccess,
      showCreatePkbMembershipConfirm,
      createPkbMembership,
    };
  },
});
</script>
