<template>
  <BaseLoadingIndicator v-if="!code"></BaseLoadingIndicator>
  <div v-else-if="code">
    <div class="px-4 sm:px-6">
      <!-- Heading -->
      <div class="mb-4">
        <CodesTitle :code="code.code" :coding-standard="code.codingStandard" />
        <p class="mt-2">
          {{ code.description || "No description found" }}
        </p>
      </div>
      <!-- Extra fields  -->
      <div class="mb-4">
        <div>
          <h5 class="inline">Type:</h5>
          <p class="inline">{{ code.objectType || "None" }}</p>
        </div>
        <div class="mt-2">
          <h5 class="inline">Units:</h5>
          <p class="inline">{{ code.units || "None" }}</p>
        </div>
      </div>
      <!-- Code lifecycle  -->
      <div class="mb-4">
        <div>
          <h5 class="inline">Created:</h5>
          <p class="inline">{{ formatDate(code.creationDate) }}</p>
        </div>
        <div class="mt-2">
          <h5 class="inline">Updated:</h5>
          <p class="inline">{{ code.updateDate ? formatDate(code.updateDate) : "Never updated" }}</p>
        </div>
      </div>
      <!-- Links -->
      <div v-if="externalLink" class="mb-4">
        <a :href="externalLink" target="_blank">{{ externalLink }}</a>
      </div>
    </div>

    <!-- Code maps  -->
    <div v-if="code.mapsTo.length > 0 || code.mappedBy.length > 0">
      <!-- Maps to  -->
      <div v-if="code.mapsTo.length > 0">
        <div class="border-t border-b bg-gray-50 py-1 pl-4 sm:pl-6">
          <h4>Maps To</h4>
        </div>
        <ul class="divide-y divide-gray-200">
          <CodesMapListItem
            v-for="mappedCode in code.mapsTo"
            :key="`${mappedCode.destinationCodingStandard}.${mappedCode.destinationCode}`"
            :map="mappedCode"
          />
        </ul>
      </div>

      <!-- Mapped by  -->
      <div v-if="code.mappedBy.length > 0">
        <div class="border-t border-b bg-gray-50 py-1 pl-4 sm:pl-6">
          <h4>Mapped By</h4>
        </div>
        <ul class="divide-y divide-gray-200">
          <CodesMapListItem
            v-for="mappedCode in code.mappedBy"
            :key="`${mappedCode.sourceCodingStandard}.${mappedCode.sourceCode}`"
            :map="mappedCode"
          />
        </ul>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useMeta, useRoute, watch } from "@nuxtjs/composition-api";
import { ExtendedCodeSchema } from "@ukkidney/ukrdc-axios-ts";

import BaseLoadingIndicator from "~/components/base/BaseLoadingIndicator.vue";
import useApi from "~/composables/useApi";
import { formatDate } from "~/helpers/dateUtils";

export default defineComponent({
  components: {
    BaseLoadingIndicator,
  },
  setup() {
    const route = useRoute();
    const { codesApi } = useApi();

    // Head
    const { title } = useMeta();
    title.value = `Code ${route.value.params.id}`;

    // Data refs

    const code = ref<ExtendedCodeSchema>();

    // Data fetching

    function getCode() {
      // Scroll to top every time we fetch a new code
      if (process.client) {
        document.getElementsByTagName("main")[0].scrollTop = 0;
      }
      // Fetch code details

      codesApi
        .getCodeDetails({
          code: route.value.params.id.split(".")[1],
          codingStandard: route.value.params.id.split(".")[0],
        })
        .then((response) => {
          code.value = response.data;
        });
    }

    onMounted(() => {
      getCode();
    });

    watch(
      () => route.value.params.id, // Watch the computed (reactive) value of params.id
      () => {
        getCode();
      }
    );

    // External code links

    const externalLink = computed(() => {
      if (!code.value) {
        return null;
      }
      if (code.value.codingStandard === "LOINC") {
        return `https://loinc.org/${code.value.code}/`;
      }
      if (code.value.codingStandard === "SNOMED") {
        return `https://termbrowser.nhs.uk/?perspective=full&conceptId1=${code.value.code}`;
      }
      return null;
    });

    return { formatDate, externalLink, code };
  },
  head: {},
});
</script>
