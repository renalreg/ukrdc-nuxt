<template>
  <div>
    <!-- Modals -->
    <BaseModal v-if="hasPermission('ukrdc:workitems:write')" ref="updateWorkItemModal">
      <div class="text-left mb-4">
        <div class="mb-4">Add Work Item comment</div>
        <BaseTextArea v-model="customComment" :max-length="100" rows="3"></BaseTextArea>
      </div>

      <!-- Allow setting as WIP if not already closed -->
      <BaseCheckbox v-if="record && record.status !== 3" v-model="isWIP" label="Mark as work-in-progress (WIP)"/>

      <div class="flex justify-end">
        <BaseButton @click="updateWorkItemModal?.hide()">Cancel</BaseButton>
        <BaseButton
          colour="indigo"
          class="ml-2"
          type="submit"
          @click="updateWorkItem()"
        >
          Save
        </BaseButton>
      </div>
    </BaseModal>

    <BaseModal v-if="hasPermission('ukrdc:workitems:write')" ref="closeModal">
      <div class="text-left">
        <div class="mb-4">{{ closeMessageOverride ? closeMessageOverride : "Close the Work Item" }}</div>

        <label>
          Comments
          <BaseTextArea v-model="customComment" :max-length="100" rows="3"></BaseTextArea>
        </label>
      </div>

      <div class="flex justify-end">
        <BaseButton @click="closeModal?.hide()"> Cancel </BaseButton>
        <BaseButton :disabled="!customComment" type="submit" class="ml-3" colour="red" @click="handleCloseWorkItem()">
          Close Work Item
        </BaseButton>
      </div>
    </BaseModal>

    <!-- Header -->
    <div class="mb-6">
      <h1 v-if="record">Work Item {{ record.id }} {{ statusString }}</h1>
      <BaseSkeleText v-else class="mb-2 h-8 w-1/4" />
      <h5 v-if="record">
        {{ record.description }}
      </h5>
      <BaseSkeleText v-else class="h-4 w-1/2" />
    </div>

    <!-- Info Cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Work Item Details -->
      <WorkItemDetailCard :item="record" />
      <!-- Work Item Advice -->
      <WorkItemAdviceCard :item="record" :related="workItemCollection" />
    </div>

    <!-- Action Buttons -->
    <div
      v-if="hasPermission('ukrdc:workitems:write') && record"
      class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <BaseButton
        v-if="availableActions.comment"
        :primary="true"
        colour="indigo"
        class="inline-flex w-full items-center justify-center"
        @click="updateWorkItemModal?.show()"
      >
        <IconPencil class="-ml-1 mr-2" />
        Update
      </BaseButton>

      <BaseButton
        v-if="availableActions.close && record.status !== 3"
        :primary="true"
        class="inline-flex w-full items-center justify-center"
        colour="green"
        @click="closeModal?.show()"
      >
        <IconCheckCircle class="-ml-1 mr-2" />
        Close
      </BaseButton>

      <BaseButton
        v-if="availableActions.merge && record.status !== 3"
        :primary="true"
        tooltip="You will be redirected here after merging"
        :to="{
          path: '/empi/merge',
          query: {
            superseded: record.incoming.masterRecords[relatedRecordsIndex].id,
            superseding: record.destination.masterRecord?.id,
            callback: $route.fullPath + '?justMerged=true',
          },
        }"
        class="inline-flex w-full items-center justify-center"
        colour="yellow"
      >
        <IconArrowTopRightOnSquare class="-ml-1 mr-2" />
        Merge Master Records
      </BaseButton>
    </div>

    <!-- Work Item Trigger -->
    <div v-if="record" class="mb-8">
      <div class="mb-8">
        <p>
          This work item was raised because demographic attributes on
          <span class="personrecord-label">{{
            record.type === 9 ? "one of the incoming data files" : "the Person Record"
          }}</span>
          below did not match the <span class="masterrecord-label">Master Record</span> it is linked to.
        </p>
        <p v-if="record.type !== 9 && messages && messages.length > 0">
          This may be because a <b>Related Data File</b> below updated the
          <span class="masterrecord-label">Master Record</span>, and this update means that it no longer matches the
          <span class="personrecord-label">Person Record</span> below.
        </p>
      </div>

      <div v-if="record.attributes" class="mb-8">
        <p class="mb-4 font-medium">
          Values of mismatching attributes <em>at the time this work item was first raised.</em>
        </p>
        <BaseTable class="sensitive">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col">Mismatched Attribute</th>
              <th scope="col">{{ record.type === 9 ? "Incoming" : "Person Record" }} Value</th>
              <th scope="col">Master Recoed Value</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300 bg-white">
            <tr v-if="record.attributes.givenname">
              <td class="font-medium">Given Name</td>
              <td>{{ record.attributes.givenname.split(":")[0] }}</td>
              <td>{{ record.attributes.givenname.split(":")[1] }}</td>
            </tr>
            <tr v-if="record.attributes.surname">
              <td class="font-medium">Surname</td>
              <td>{{ record.attributes.surname.split(":")[0] }}</td>
              <td>{{ record.attributes.surname.split(":")[1] }}</td>
            </tr>
            <tr v-if="record.attributes.localid">
              <td class="font-medium">Local ID</td>
              <td>{{ record.attributes.localid.split(":")[0] }}</td>
              <td>{{ record.attributes.localid.split(":")[1] }}</td>
            </tr>
            <tr v-if="record.attributes.sendingFacility">
              <td class="font-medium">Sending Facility</td>
              <td>{{ record.attributes.sendingFacility.split(":")[0] }}</td>
              <td>{{ record.attributes.sendingFacility.split(":")[1] }}</td>
            </tr>
            <tr v-if="record.attributes.sendingExtract">
              <td class="font-medium">Sending Extract</td>
              <td>{{ record.attributes.sendingExtract.split(":")[0] }}</td>
              <td>{{ record.attributes.sendingExtract.split(":")[1] }}</td>
            </tr>
            <tr v-if="record.attributes.dateOfBirth">
              <td class="font-medium">Date of Birth</td>
              <td>{{ formatDate(record.attributes.dateOfBirth.split(":")[0], false) }}</td>
              <td>{{ formatDate(record.attributes.dateOfBirth.split(":")[1], false) }}</td>
            </tr>
            <tr v-if="record.attributes.dateOfDeath">
              <td class="font-medium">Date of Death</td>
              <td>{{ formatDate(record.attributes.dateOfDeath.split(":")[0], false) }}</td>
              <td>{{ formatDate(record.attributes.dateOfDeath.split(":")[1], false) }}</td>
            </tr>
            <tr v-if="record.attributes.gender">
              <td class="font-medium">Gender</td>
              <td>{{ formatGender(record.attributes.gender.split(":")[0]) }}</td>
              <td>{{ formatGender(record.attributes.gender.split(":")[1]) }}</td>
            </tr>
          </tbody>
        </BaseTable>
      </div>

      <div class="mb-4">
        <p class="font-medium">Summary of currently stored record demographics.</p>
        <p>If these now match, this work item can likely be closed with no further action.</p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="incomingCard">
          <!-- Else incoming person card -->
          <PersonRecordCard
            v-if="record.incoming.person"
            :record="record.incoming.person"
            :label="`Person Record ${record.incoming.person.id}`"
            :highlight="highlightedAttributes"
            :full="showDestinationPersons"
          />
          <!-- Missing incoming person card -->
          <div v-else class="rounded-md bg-yellow-50 p-4 font-medium text-yellow-800">
            <span v-if="record.type === 9">
              Incoming file was rejected, so no Person record exists for this work item yet.
              <br />
              See Related Data Files below to identify the rejected file.
            </span>
            <span v-else> Person record associated with this work item is missing, and may have been deleted. </span>
          </div>
        </div>

        <div id="destinationCard">
          <!-- Destination record card -->
          <NuxtLink v-if="record.destination.masterRecord" :to="`/masterrecords/${record.destination.masterRecord.id}`">
            <MasterRecordCard
              :record="record.destination.masterRecord"
              :label="`Destination Master Record ${record.destination.masterRecord.id}`"
            />
          </NuxtLink>
          <!-- Missing destination record card -->
          <div v-else class="rounded-md bg-red-50 p-4 text-red-800">
            <p class="font-medium">Destination record no longer exists</p>
            <p>The record may have been merged or delete already</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Proposed Merge -->
    <div v-if="availableActions.merge">
      <h2 class="mb-4">Proposed Merge</h2>

      <div v-if="record" class="mb-8">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Incoming records card -->
          <NuxtLink
            v-if="record.incoming.masterRecords.length > 0"
            :to="`/masterrecords/${record.incoming.masterRecords[relatedRecordsIndex].id}`"
          >
            <MasterRecordCard
              :record="record.incoming.masterRecords[relatedRecordsIndex]"
              :label="`Incoming Master Record ${relatedRecordsIndex + 1} of ${record.incoming.masterRecords.length}`"
            />
          </NuxtLink>
          <!-- Empty incoming records card -->
          <div v-else class="rounded-md bg-red-50 p-4 font-medium text-red-800">No new incoming Master Records</div>
          <NuxtLink v-if="record.destination.masterRecord" :to="`/masterrecords/${record.destination.masterRecord.id}`">
            <MasterRecordCard :record="record.destination.masterRecord" label="Destination Master Record" />
          </NuxtLink>
        </div>
        <BaseCard v-if="record.incoming.masterRecords.length > 1" class="mt-2 pl-4">
          <BaseItemPaginator
            v-model="relatedRecordsIndex"
            :total="record.incoming.masterRecords.length"
            item-label="Record"
        /></BaseCard>
      </div>
    </div>

    <!-- Related messages card -->
    <div v-if="messages && messages.length > 0" class="mb-8">
      <BaseCard>
        <BaseCardHeader>
          <h2>Related Data Files</h2>
          <h6>
            Data files received around the time the work item was first raised. One of these may be responsible for the
            work item.
          </h6>
        </BaseCardHeader>
        <ul class="divide-y divide-gray-300">
          <div v-for="item in messages" :key="item.id" :item="item" class="hover:bg-gray-50">
            <NuxtLink :to="`/messages/${item.id}`">
              <MessagesListItem :item="item" />
            </NuxtLink>
          </div>
        </ul>
        <BasePaginator
          class="border-t border-gray-200 bg-white"
          :jump-to-top="false"
          :page="messagesPage"
          :size="messagesSize"
          :total="messagesTotal"
          @next="messagesPage++"
          @prev="messagesPage--"
          @jump="messagesPage = $event"
        />
      </BaseCard>
    </div>

    <!-- Related Work Items  -->
    <BaseCard v-if="workItemCollection.length > 0" class="mb-8">
      <!-- Card header -->
      <BaseCardHeader>
        <h2>Related Work Items</h2>
        <h6>Work Items for the same patient, raised by the same event</h6>
      </BaseCardHeader>
      <!-- Results list -->
      <ul class="divide-y divide-gray-300">
        <div v-for="item in workItemCollection" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <WorkItemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </BaseCard>

    <!-- Related errors card -->
    <WorkItemRelatedErrorsList v-if="record" class="mb-8 mt-4" :workitem="record" :size="5" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  watch,
} from "@nuxtjs/composition-api";
import { MessageSchema, WorkItemExtendedSchema, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseButton from "~/components/base/BaseButton.vue";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseCheckbox from "~/components/base/BaseCheckbox.vue";
import BaseItemPaginator from "~/components/base/BaseItemPaginator.vue";
import BaseModal from "~/components/base/BaseModal.vue";
import BaseSkeleText from "~/components/base/BaseSkeleText.vue";
import BaseTable from "~/components/base/BaseTable.vue";
import BaseTextArea from "~/components/base/BaseTextArea.vue";
import IconArrowTopRightOnSquare from "~/components/icons/hero/20/solid/IconArrowTopRightOnSquare.vue";
import IconCheckCircle from "~/components/icons/hero/20/solid/IconCheckCircle.vue";
import IconPencil from "~/components/icons/hero/20/solid/IconPencil.vue";
import MasterRecordCard from "~/components/MasterRecordCard.vue";
import MessagesListItem from "~/components/messages/MessagesListItem.vue";
import PersonRecordCard from "~/components/PersonRecordCard.vue";
import WorkItemAdviceCard from "~/components/workitem/WorkItemAdviceCard.vue";
import WorkItemDetailCard from "~/components/workitem/WorkItemDetailCard.vue";
import WorkItemRelatedErrorsList from "~/components/workitem/WorkItemRelatedErrorsList.vue";
import WorkItemsListItem from "~/components/workitem/WorkItemsListItem.vue";
import useApi from "~/composables/useApi";
import usePermissions from "~/composables/usePermissions";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";
import { isEmptyObject } from "~/helpers/objectUtils";
import { delay } from "~/helpers/timeUtils";
import { workItemIsMergable } from "~/helpers/workItemUtils";
import { ModalInterface } from "~/interfaces/modal";

interface AvailableActions {
  close: boolean;
  comment: boolean;
  merge: boolean;
  unlink: boolean;
}

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
    BaseCardHeader,
    BaseSkeleText,
    BaseItemPaginator,
    BaseTextArea,
    BaseTable,
    BaseModal,
    BaseCheckbox,
    IconCheckCircle,
    IconArrowTopRightOnSquare,
    IconPencil,
    PersonRecordCard,
    MasterRecordCard,
    WorkItemAdviceCard,
    WorkItemDetailCard,
    WorkItemRelatedErrorsList,
    WorkItemsListItem,
    MessagesListItem,
  },
  setup() {
    // Dependencies
    const route = useRoute();
    const { $toast } = useContext();
    const { hasPermission } = usePermissions();
    const { workItemsApi } = useApi();

    // Head
    const { title } = useMeta();
    title.value = `Work Item ${route.value.params.id}`;

    // Work item record data
    const record = ref<WorkItemExtendedSchema>();
    const customComment = ref("");
    
    const isWIP = ref(false)

    const highlightedAttributes = computed(() => {
      const attributeKeys: string[] = [];
      if (record.value?.attributes) {
        Object.entries(record.value.attributes).forEach(([key, value]) => {
          if (value) {
            attributeKeys.push(key);
          }
        });
      }
      return attributeKeys;
    });

    // Related persons data
    const workItemCollection = ref([] as WorkItemSchema[]);

    // Related messages data
    const messages = ref<MessageSchema[]>();
    const messagesPage = ref(1);
    const messagesSize = ref(5);
    const messagesTotal = ref(0);

    // Related record paginator data
    const relatedRecordsIndex = ref(0);
    const relatedPersonsIndex = ref(0);

    // Data fetching

    function updateRelatedMessages() {
      workItemsApi
        .getWorkitemMessages({
          workitemId: Number(route.value.params.id),
        })
        .then((response) => {
          messages.value = response.data.items;
          messagesPage.value = response.data.page ?? 0;
          messagesSize.value = response.data.size ?? 0;
          messagesTotal.value = response.data.total;
        });
    }

    function getWorkItem() {
      workItemsApi
        .getWorkitem({
          workitemId: Number(route.value.params.id),
        })
        .then((response) => {
          record.value = response.data;
          isWIP.value = response.data.status === 2
        });

      workItemsApi
        .getWorkitemCollection({
          workitemId: Number(route.value.params.id),
        })
        .then((response) => {
          workItemCollection.value = response.data;
        });

      updateRelatedMessages();

      // Apply existing comment
      customComment.value = record.value?.updateDescription || "";

      // Check if the workitem has already been merged and is ready to be closed
      checkMerged();
    }

    onMounted(() => {
      getWorkItem();
    });

    watch(messagesPage, () => {
      updateRelatedMessages();
    });

    // Trigger dynamic modals

    function checkMerged() {
      if (
        record.value?.status === 1 &&
        record.value?.destination.masterRecord?.nationalidType === "UKRDC" &&
        record.value?.incoming?.masterRecords?.length !== undefined &&
        record.value?.incoming?.masterRecords?.length <= 0 &&
        route.value.query.justMerged === "true"
      ) {
        closeMessageOverride.value =
          "It looks like the incoming Master Record for this Work Item has been merged. Close the Work Item?";
        closeModal.value?.show();
      }
    }

    // Dynamic UI

    const statusString = computed(() => {
      if (record.value?.status === 1) {
        return "(Open)";
      } else if (record.value?.status === 2) {
        return "(WIP)";
      } else if (record.value?.status === 3) {
        return "(Closed)";
      } else {
        return "(Unknown status)";
      }
    });

    const showIncomingAttributes = ref(false);

    const showDestinationPersons = ref(false);

    const availableActions = computed<AvailableActions>(() => {
      return {
        // We can always comment and close?
        close: true,
        comment: true,
        // We can only merge if we have an incoming Master Record, and both
        // incoming and destination records are UKRDC type
        merge: record.value ? workItemIsMergable(record.value) : false,
        // Currently Unlink never makes sense, so ignore for now. Maybe remove entirely?
        unlink: false,
      } as AvailableActions;
    });

    const closeMessageOverride = ref<String>();

    // Template refs
    const updateWorkItemModal = ref<ModalInterface>();
    const closeModal = ref<ModalInterface>();

    // Workitem actions
    function statusToSet(): number | undefined {
      if (record.value?.status === 2 && !isWIP.value) {
        return 1
      }
      if (record.value?.status === 1 && isWIP.value) {
        return 2
      }
      return record.value?.status
    }

    function updateWorkItem() {
      workItemsApi
        .putWorkitemUpdate({
          workitemId: Number(route.value.params.id),
          updateWorkItemRequest: {
            comment: customComment.value,
            status: statusToSet()
          },
        })
        .then(() => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "Work item updated. Reloading...",
            timeout: 5,
            classTimeout: "bg-green-600",
          });
        })
        .catch((error) => {
          $toast.show({
            type: "danger",
            title: "Error",
            message: error.response.data.detail,
            timeout: 10,
            classTimeout: "bg-red-600",
          });
          throw error;
        })
        .finally(() => {
          // Delay fetch to allow JTRACE time to process
          delay(1000).then(() => {
            getWorkItem();
          });
        });

      const el = updateWorkItemModal.value as ModalInterface;
      el.toggle();
    }

    function handleCloseWorkItem() {
      workItemsApi
        .postWorkitemClose({
          workitemId: Number(route.value.params.id),
          closeWorkItemRequest: {
            comment: customComment.value,
          },
        })
        .then(() => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "Work Item closed. Reloading...",
            classTimeout: "bg-green-600",
          });
        })
        .catch((error) => {
          $toast.show({
            type: "danger",
            title: "Error",
            message: error.response.data.detail,
            timeout: 10,
            classTimeout: "bg-red-600",
          });
          throw error;
        })
        .finally(() => {
          // Delay fetch to allow JTRACE time to process
          delay(1000).then(() => {
            getWorkItem();
          });
        });

      const el = closeModal.value as ModalInterface;
      el.toggle();
    }

    return {
      record,
      highlightedAttributes,
      formatDate,
      formatGender,
      isEmptyObject,
      workItemCollection,
      messages,
      messagesPage,
      messagesSize,
      messagesTotal,
      relatedRecordsIndex,
      relatedPersonsIndex,
      customComment,
      isWIP,
      statusString,
      availableActions,
      updateWorkItemModal,
      closeModal,
      closeMessageOverride,
      showIncomingAttributes,
      showDestinationPersons,
      updateWorkItem,
      handleCloseWorkItem,
      hasPermission,
    };
  },
  head: {
    title: "Work Item",
  },
});
</script>

<style scoped lang="postcss">
th {
  @apply px-4 py-3;
}
td {
  @apply whitespace-nowrap px-4 py-4;
}

.masterrecord-label {
  @apply font-medium text-indigo-800;
}

.personrecord-label {
  @apply font-medium text-yellow-700;
}
</style>
