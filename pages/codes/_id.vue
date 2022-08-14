<template>
  <LoadingIndicator v-if="!code"></LoadingIndicator>
  <div v-else-if="code">
    <div class="px-4 sm:px-6">
      <!-- Heading -->
      <div class="mb-4">
        <CodesTitle :code="code.code" :coding-standard="code.codingStandard" />
        <TextP class="mt-2">
          {{ code.description || "No description found" }}
        </TextP>
      </div>
      <!-- Extra fields  -->
      <div class="mb-4">
        <div>
          <TextL1 class="inline">Type: </TextL1><TextP class="inline">{{ code.objectType || "None" }} </TextP>
        </div>
        <div class="mt-2">
          <TextL1 class="inline">Units: </TextL1><TextP class="inline">{{ code.units || "None" }} </TextP>
        </div>
      </div>
      <!-- Code lifecycle  -->
      <div class="mb-4">
        <div>
          <TextL1 class="inline">Created: </TextL1><TextP class="inline">{{ formatDate(code.creationDate) }} </TextP>
        </div>
        <div class="mt-2">
          <TextL1 class="inline">Updated: </TextL1
          ><TextP class="inline">{{ code.updateDate ? formatDate(code.updateDate) : "Never updated" }} </TextP>
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
          <TextH4>Maps To</TextH4>
        </div>
        <ul class="divide-y divide-gray-200">
          <CodesMapListItem
            v-for="mappedCode in code.mapsTo"
            :key="`${mappedCode.codingStandard}.${mappedCode.code}`"
            :map="mappedCode"
          />
        </ul>
      </div>

      <!-- Mapped by  -->
      <div v-if="code.mappedBy.length > 0">
        <div class="border-t border-b bg-gray-50 py-1 pl-4 sm:pl-6">
          <TextH4>Mapped By</TextH4>
        </div>
        <ul class="divide-y divide-gray-200">
          <CodesMapListItem
            v-for="mappedCode in code.mappedBy"
            :key="`${mappedCode.codingStandard}.${mappedCode.code}`"
            :map="mappedCode"
          />
        </ul>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script lang="ts">
import { ExtendedCodeSchema } from "@ukkidney/ukrdc-axios-ts";
import { formatDate } from "@/helpers/utils/dateUtils";
import useApi from "~/helpers/useApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const { codesApi } = useApi();

    // Head
    useHead({
      title: computed(() => `Code ${route.params.id}`),
    });

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
          code: route.params.id.split(".")[1],
          codingStandard: route.params.id.split(".")[0],
        })
        .then((response) => {
          code.value = response.data;
        });
    }

    onMounted(() => {
      getCode();
    });

    watch(
      () => route.params.id, // Watch the computed (reactive) value of params.id
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
});
</script>
