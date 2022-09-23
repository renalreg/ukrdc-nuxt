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
        <BaseButton @click="unlinkModal?.hide()">Cancel</BaseButton>
        <BaseButton :primary="true" colour="red" class="ml-2" type="submit" @click="doUnlink()"> Unlink </BaseButton>
      </div>
    </GenericModalSlot>

    <BaseCard class="mb-2 flex items-center p-2">
      <div class="flex-grow pl-2">
        <h5>Link Record {{ record.id }}</h5>
      </div>
      <div class="flex-shrink">
        <BaseButtonMini @click="unlinkModal?.show()">Unlink</BaseButtonMini>
      </div>
    </BaseCard>

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
import BaseCard from "~/components/base/BaseCard.vue";
import BaseButtonMini from "@/components/base/BaseButtonMini.vue";
import BaseButton from "@/components/base/BaseButton.vue";

import { formatDate } from "~/helpers/dateUtils";
import { formatGender } from "~/helpers/codeUtils";

import { modalInterface } from "~/interfaces/modal";
import useApi from "~/composables/useApi";

export default defineComponent({
  components: {
    BaseButton,
    BaseButtonMini,
    BaseCard,
  },
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
