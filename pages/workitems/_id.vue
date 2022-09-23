<template>
  <div>
    <!-- Modals -->
    <GenericModalSlot v-if="hasPermission('ukrdc:workitems:write')" ref="addCommentModal">
      <div class="text-left">
        <div class="mb-4">Add Work Item comment</div>
        <FormTextArea v-model="customComment" :max-length="100" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <BaseButton @click="addCommentModal?.hide()">Cancel</BaseButton>
        <BaseButton
          :disabled="!customComment"
          colour="indigo"
          class="ml-2"
          type="submit"
          @click="updateWorkItemComment()"
        >
          Save
        </BaseButton>
      </div>
    </GenericModalSlot>

    <GenericModalSlot v-if="hasPermission('ukrdc:workitems:write')" ref="closeModal">
      <div class="text-left">
        <div class="mb-4">{{ closeMessageOverride ? closeMessageOverride : "Close the Work Item" }}</div>

        <div>
          <FormLabel>
            Comments
            <FormTextArea v-model="customComment" :max-length="100" rows="3"></FormTextArea>
          </FormLabel>
        </div>
      </div>

      <div class="flex justify-end">
        <BaseButton @click="closeModal?.hide()"> Cancel </BaseButton>
        <BaseButton :disabled="!customComment" type="submit" class="ml-3" colour="red" @click="handleCloseWorkItem()">
          Close Work Item
        </BaseButton>
      </div>
    </GenericModalSlot>

    <!-- Header -->
    <div class="mb-6">
      <h1 v-if="record">Work Item {{ record.id }} {{ statusString }}</h1>
      <SkeleText v-else class="mb-2 h-8 w-1/4" />
      <TextL1 v-if="record">
        {{ record.description }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <!-- Info Cards -->
    <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Work Item Details -->
      <WorkitemsDetailCard :item="record" />
      <!-- Work Item Advice -->
      <WorkitemsAdviceCard :item="record" :related="workItemCollection" />
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
        @click="addCommentModal?.show()"
      >
        <IconPencil />
        Comment
      </BaseButton>

      <BaseButton
        v-if="availableActions.close && record.status !== 3"
        :primary="true"
        class="inline-flex w-full items-center justify-center"
        colour="green"
        @click="closeModal?.show()"
      >
        <IconCheckCircle />
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
        <IconMiniExternalLink />
        Merge Master Records
      </BaseButton>
    </div>

    <!-- Work Item Trigger -->
    <div v-if="record" class="mb-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="incomingCard">
          <!-- Attribute toggle -->
          <GenericTabToggle
            v-model="showIncomingAttributes"
            true-label="Incoming Attributes"
            false-label="Incoming Person Record"
            class="mb-2"
          />
          <!-- Type 9 incoming attribute card -->
          <WorkitemsAttributeRecordCard
            v-if="showIncomingAttributes"
            :record="record.attributes"
            label="Incoming Attributes"
            :highlight="highlightedAttributes"
            :full="showDestinationPersons"
          />
          <!-- Else incoming person card -->
          <personsRecordCard
            v-else-if="record.incoming.person"
            :record="record.person"
            :label="`Incoming Person Record ${record.incoming.person.id}`"
            :highlight="highlightedAttributes"
            :full="showDestinationPersons"
          />
          <!-- Missing incoming person card -->
          <div v-else class="rounded-md bg-red-50 p-4 font-medium text-red-800">No incoming Person record</div>
        </div>

        <div id="destinationCard">
          <!-- Destination toggle -->
          <GenericTabToggle
            v-model="showDestinationPersons"
            true-label="Related Person Records"
            false-label="Destination Master Record"
            class="mb-2"
          />
          <!-- Destination person card -->
          <personsRecordCard
            v-if="showDestinationPersons && record.destination.persons.length > 0"
            :record="record.destination.persons[relatedPersonsIndex]"
            :label="`Related Person Record ${relatedPersonsIndex + 1} of ${record.destination.persons.length}`"
            :highlight="highlightedAttributes"
            :full="true"
          />
          <!-- Destination record card -->
          <NuxtLink
            v-else-if="record.destination.masterRecord"
            :to="`/masterrecords/${record.destination.masterRecord.id}`"
          >
            <masterrecordsRecordCard
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
      <BaseCard v-if="showDestinationPersons && record.destination.persons.length > 1" class="mt-2 pl-4">
        <GenericItemPaginator
          v-model="relatedPersonsIndex"
          :total="record.destination.persons.length"
          item-label="Record"
      /></BaseCard>
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
            <masterrecordsRecordCard
              :record="record.incoming.masterRecords[relatedRecordsIndex]"
              :label="`Incoming Master Record ${relatedRecordsIndex + 1} of ${record.incoming.masterRecords.length}`"
            />
          </NuxtLink>
          <!-- Empty incoming records card -->
          <div v-else class="rounded-md bg-red-50 p-4 font-medium text-red-800">No new incoming Master Records</div>
          <NuxtLink v-if="record.destination.masterRecord" :to="`/masterrecords/${record.destination.masterRecord.id}`">
            <masterrecordsRecordCard :record="record.destination.masterRecord" label="Destination Master Record" />
          </NuxtLink>
        </div>
        <BaseCard v-if="record.incoming.masterRecords.length > 1" class="mt-2 pl-4">
          <GenericItemPaginator
            v-model="relatedRecordsIndex"
            :total="record.incoming.masterRecords.length"
            item-label="Record"
        /></BaseCard>
      </div>
    </div>

    <!-- Related Work Items  -->
    <BaseCard v-if="workItemCollection.length > 0" class="mb-8">
      <!-- Card header -->
      <BaseCardHeader>
        <h2>Related Work Items</h2>
        <TextL2>Work Items for the same patient, raised by the same event</TextL2>
      </BaseCardHeader>
      <!-- Results list -->
      <ul class="divide-y divide-gray-200">
        <div v-for="item in workItemCollection" :key="item.id" :item="item" class="hover:bg-gray-50">
          <NuxtLink :to="`/workitems/${item.id}`">
            <workitemsListItem :item="item" />
          </NuxtLink>
        </div>
      </ul>
    </BaseCard>

    <!-- Related errors card -->
    <WorkitemsRelatedErrorsList v-if="record" class="mt-4 mb-8" :workitem="record" :size="5" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useMeta, useRoute } from "@nuxtjs/composition-api";
import { WorkItemExtendedSchema, WorkItemSchema } from "@ukkidney/ukrdc-axios-ts";
import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardHeader from "~/components/base/BaseCardHeader.vue";
import BaseButton from "@/components/base/BaseButton.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";
import { isEmptyObject } from "~/helpers/objectUtils";
import { delay } from "~/helpers/timeUtils";
import { workItemIsMergable } from "~/helpers/workItemUtils";

import { modalInterface } from "~/interfaces/modal";

import usePermissions from "~/composables/usePermissions";
import useApi from "~/composables/useApi";

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

    // Related record paginator data
    const relatedRecordsIndex = ref(0);
    const relatedPersonsIndex = ref(0);

    // Data fetching

    function getWorkItem() {
      workItemsApi
        .getWorkitem({
          workitemId: Number(route.value.params.id),
        })
        .then((response) => {
          record.value = response.data;
        });

      workItemsApi
        .getWorkitemCollection({
          workitemId: Number(route.value.params.id),
        })
        .then((response) => {
          workItemCollection.value = response.data;
        });

      // Apply existing comment
      customComment.value = record.value?.updateDescription || "";

      // Check if the workitem has already been merged and is ready to be closed
      checkMerged();
    }

    onMounted(() => {
      getWorkItem();
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
        return "";
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
    const addCommentModal = ref<modalInterface>();
    const closeModal = ref<modalInterface>();

    // Workitem actions
    function updateWorkItemComment() {
      workItemsApi
        .putWorkitemUpdate({
          workitemId: Number(route.value.params.id),
          updateWorkItemRequest: {
            comment: customComment.value,
          },
        })
        .then(() => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "Comment added",
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

      const el = addCommentModal.value as modalInterface;
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
            message: "Work Item closed",
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

      const el = closeModal.value as modalInterface;
      el.toggle();
    }

    return {
      record,
      highlightedAttributes,
      formatDate,
      formatGender,
      isEmptyObject,
      workItemCollection,
      relatedRecordsIndex,
      relatedPersonsIndex,
      customComment,
      statusString,
      availableActions,
      addCommentModal,
      closeModal,
      closeMessageOverride,
      showIncomingAttributes,
      showDestinationPersons,
      updateWorkItemComment,
      handleCloseWorkItem,
      hasPermission,
    };
  },
  head: {
    title: "Work Item",
  },
});
</script>
