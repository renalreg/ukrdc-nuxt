<!-- 
Shows a Link Record as a Person card and a Master Record card.
Includes a header with the Link Record ID and functionality to Unlink the records.
-->

<template>
  <div>
    <GenericModalSlot ref="unlinkModal">
      <div class="text-left">
        <div class="mb-4">Unlink comment</div>
        <FormTextArea v-model="unlinkComment" :max-length="100" rows="3"></FormTextArea>
      </div>

      <div class="flex justify-end">
        <GenericButton @click="unlinkModal.hide()">Cancel</GenericButton>
        <GenericButton :primary="true" colour="red" class="ml-2" type="submit" @click="doUnlink()">
          Unlink
        </GenericButton>
      </div>
    </GenericModalSlot>

    <GenericCard class="mb-2 flex items-center p-2">
      <div class="flex-grow pl-2">
        <TextL1>Link Record {{ record.id }}</TextL1>
      </div>
      <div class="flex-shrink">
        <GenericButtonMini @click="unlinkModal.show()">Unlink</GenericButtonMini>
      </div>
    </GenericCard>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <PersonsRecordCard :record="record.person" />
      <NuxtLink :to="`/masterrecords/${record.masterRecord.id}`">
        <masterrecordsRecordCard :record="record.masterRecord" />
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from "@nuxtjs/composition-api";

import { LinkRecordSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";
import { formatGender } from "@/helpers/utils/codeUtils";

import { modalInterface } from "~/interfaces/modal";
import useApi from "~/helpers/useApi";

export default defineComponent({
  props: {
    record: {
      type: Object as () => LinkRecordSchema,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const { $toast } = useContext();
    const { patientIndexOperationsApi } = useApi();

    const unlinkModal = ref<modalInterface>();
    const unlinkComment = ref("");

    function doUnlink() {
      patientIndexOperationsApi
        .postEmpiUnlink({
          unlinkRequest: {
            personId: props.record.person.id,
            masterId: props.record.masterRecord.id,
            comment: unlinkComment.value,
          },
        })
        .then((response) => {
          $toast.show({
            type: "success",
            title: "Success",
            message: "Record unlink request sent successfully",
            timeout: 10,
            classTimeout: "bg-green-600",
          });
          router.push({ path: `/masterrecords/${response.data.masterRecord.id}` });
        })
        .finally(() => {
          unlinkModal.value?.hide();
        });
    }

    return {
      unlinkModal,
      unlinkComment,
      doUnlink,
      formatGender,
      formatDate,
    };
  },
});
</script>

<style></style>
