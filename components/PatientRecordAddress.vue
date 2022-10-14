<template>
  <div v-if="address" class="sensitive">
    <p>
      <b>{{ address.street }}</b>
    </p>

    <p v-if="address.town">{{ address.town }}</p>
    <p v-if="address.county">
      {{ address.county }}
    </p>
    <PostCodeLink v-if="address.postcode" :code="address.postcode" />
    <p v-if="address.countryDescription">
      {{ address.countryDescription }}
    </p>
    <p v-if="address.fromTime">Since {{ formatDate(address.fromTime, false) }}</p>
    <span
      v-if="!address.toTime"
      class="mt-2 flex-shrink-0 rounded-sm bg-green-100 px-2 py-0.5 text-sm font-medium text-green-800"
      >Active</span
    >
    <span v-else class="lex-shrink-0 mt-2 rounded-sm bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800"
      >Inactive since {{ formatDate(address.toTime, false) }}</span
    >
  </div>
  <p v-else>No address on record</p>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { AddressSchema } from "@ukkidney/ukrdc-axios-ts";

import PostCodeLink from "~/components/PostCodeLink.vue";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    PostCodeLink,
  },
  props: {
    address: {
      type: Object as () => AddressSchema,
      required: false,
      default: undefined,
    },
  },
  setup() {
    return {
      formatDate,
    };
  },
});
</script>
