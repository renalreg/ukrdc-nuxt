<template>
  <LoadingIndicator v-if="!code"></LoadingIndicator>
  <div v-else-if="code">
    <div class="px-4 sm:px-6">
      <!-- Heading -->
      <div class="mb-4">
        <CodesTitle :code="code.code" :coding-standard="code.codingStandard" />
        <TextP class="mt-2">
          {{ code.description || 'No description found' }}
        </TextP>
      </div>
      <!-- Extra fields  -->
      <div class="mb-4">
        <div>
          <TextL1 class="inline">Type: </TextL1><TextP class="inline">{{ code.objectType || 'None' }} </TextP>
        </div>
        <div class="mt-2">
          <TextL1 class="inline">Units: </TextL1><TextP class="inline">{{ code.units || 'None' }} </TextP>
        </div>
      </div>
      <!-- Code lifecycle  -->
      <div class="mb-4">
        <div>
          <TextL1 class="inline">Created: </TextL1><TextP class="inline">{{ formatDate(code.creationDate) }} </TextP>
        </div>
        <div class="mt-2">
          <TextL1 class="inline">Updated: </TextL1
          ><TextP class="inline">{{ code.updateDate ? formatDate(code.updateDate) : 'Never updated' }} </TextP>
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
        <div class="bg-gray-50 pl-4 sm:pl-6 py-1 border-t border-b">
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
        <div class="bg-gray-50 pl-4 sm:pl-6 py-1 border-t border-b">
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
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { ExtendedCode } from '@/interfaces/codes'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()

    // Head
    const { title } = useMeta()
    title.value = `Code ${route.value.params.id}`

    // Data refs

    const code = ref<ExtendedCode>()

    // Data fetching

    async function fetchCode() {
      // Scroll to top every time we fetch a new code
      if (process.client) {
        document.getElementsByTagName('main')[0].scrollTop = 0
      }
      // Fetch code details
      code.value = await $axios.$get(`${$config.apiBase}/v1/codes/list/${route.value.params.id}/`)
    }

    onMounted(() => {
      fetchCode()
    })

    watch(route, () => {
      fetchCode()
    })

    // External code links

    const externalLink = computed(() => {
      if (!code.value) {
        return null
      }
      if (code.value.codingStandard === 'LOINC') {
        return `https://loinc.org/${code.value.code}/`
      }
      if (code.value.codingStandard === 'SNOMED') {
        return `https://termbrowser.nhs.uk/?perspective=full&conceptId1=${code.value.code}`
      }
      return null
    })

    return { formatDate, externalLink, code }
  },
  head: {},
})
</script>
