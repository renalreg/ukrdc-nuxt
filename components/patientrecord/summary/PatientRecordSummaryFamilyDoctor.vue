<template>
  <ul>
    <li
      v-for="(info, index) in [record.patient.familydoctor.gpInfo, record.patient.familydoctor.gpPracticeInfo].filter(
        (x) => x
      )"
      :key="`gp-info-${index}`"
      class="col-span-1"
    >
      <BaseCard class="sensitive w-full px-4 py-2">
        <b>{{ info.type }} Information</b>
        <p>{{ info.gpname || "GP name not known" }}</p>
        <p>{{ info.street }}</p>
        <PostCodeLink v-if="info.postcode" :code="info.postcode" />
        <p>Contact {{ info.contactvalue }}</p>
      </BaseCard>
    </li>
    <li v-if="!record.patient.familydoctor.gpInfo">
      <BaseCard class="sensitive w-full px-4 py-2">
        <b>GP Information</b>
        <p>{{ record.patient.familydoctor.gpname || "GP name not known" }}</p>
        <p>{{ record.patient.familydoctor.street }}</p>
        <PostCodeLink v-if="record.patient.familydoctor.postcode" :code="record.patient.familydoctor.postcodee" />
        <p>Contact {{ record.patient.familydoctor.contactvalue }}</p>
      </BaseCard>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import PostCodeLink from "~/components/PostCodeLink.vue";

export default defineComponent({
  components: {
    PostCodeLink,
    BaseCard,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="postcss" scoped></style>
