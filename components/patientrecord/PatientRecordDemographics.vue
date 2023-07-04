<template>
  <BaseCard class="mb-4">
    <BaseCardContent>
      <BaseDescriptionListGrid>
        <BaseDescriptionListGridItem>
          <dt>Names</dt>
          <dd>
            <p v-for="item in record.patient?.names || []" :key="item.given + item.family" class="sensitive">
              {{ item.given }} {{ item.family }}
            </p>
          </dd>
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Gender</dt>
          <dd class="sensitive">{{ formatGender(record.patient.gender) }}</dd>
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Ethnicity</dt>
          <dd class="sensitive">
            {{ record.patient.ethnicGroupDescription || record.patient.ethnicGroupCode || "Unknown" }}
          </dd>
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Date of Birth</dt>
          <dd class="sensitive">{{ formatDate(record.patient.birthTime, false) }}</dd>
        </BaseDescriptionListGridItem>
        <BaseDescriptionListGridItem>
          <dt>Date of Death</dt>
          <dd class="sensitive">
            {{ record.patient.deathTime ? formatDate(record.patient.deathTime, false) : "N/A" }}
          </dd>
        </BaseDescriptionListGridItem>
      </BaseDescriptionListGrid>
    </BaseCardContent>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { PatientRecordSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseCard from "~/components/base/BaseCard.vue";
import BaseCardContent from "~/components/base/BaseCardContent.vue";
import BaseDescriptionListGrid from "~/components/base/BaseDescriptionListGrid.vue";
import BaseDescriptionListGridItem from "~/components/base/BaseDescriptionListGridItem.vue";
import { formatGender } from "~/helpers/codeUtils";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseDescriptionListGrid,
    BaseDescriptionListGridItem,
    BaseCardContent,
    BaseCard,
  },
  props: {
    record: {
      type: Object as () => PatientRecordSchema,
      required: true,
    },
  },
  setup() {
    return {
      formatGender,
      formatDate,
    };
  },
});
</script>

<style lang="postcss" scoped></style>
