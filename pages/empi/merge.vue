<template>
  <div>
    <GenericModalConfirm
      ref="beginMergeAlert"
      title="Begin Record Merge"
      message="Are you sure you want to begin merging these records?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm="requestMerge()"
    />

    <div class="max-w-7xl mx-auto mb-4">
      <TextH1>Merge Records</TextH1>
    </div>

    <div class="block lg:flex gap-2 mb-6">
      <div class="flex-1">
        <div v-if="superseded">
          <GenericButton class="w-full" @click="clearSuperceeded"> Change Superseded Record </GenericButton>
          <NuxtLink :to="`/masterrecords/${superseded.id}`">
            <masterrecordsRecordCard
              class="mt-4"
              :record="superseded"
              :label="`Superseded Record ${superseded.id.toString()}`"
              :highlight="highlightSections"
            />
          </NuxtLink>
        </div>
        <div v-else>
          <EmpiSearch v-if="searchingFor === 'superseded'" :only-ukrdc="true" @select="selectSuperceeded" />
          <GenericButton v-else class="w-full" @click="searchingFor = 'superseded'">
            Search for a Record
          </GenericButton>
        </div>
      </div>

      <div class="flex-none flex flex-row lg:flex-col my-4 lg:my-0 lg:w-8 mb-2 justify-center lg:justify-start">
        <div class="flex-shrink">
          <button
            v-tooltip="'Switch Records'"
            class="
              w-8
              block
              mx-auto
              rounded-md
              shadow-sm
              font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2
              border
              bg-white
              hover:bg-gray-50
              focus:ring-indigo-500
              border-gray-300
              text-gray-700
            "
            @click="switchRecords"
          >
            <IconSwitchH class="hidden lg:block my-2" /><IconSwitchV class="block lg:hidden my-2" />
          </button>
        </div>
        <div class="hidden lg:flex flex-col flex-grow justify-center">
          <div v-show="superseded && superseding" class="h-8"><IconArrowRight /></div>
        </div>
      </div>

      <div class="flex-1">
        <div v-if="superseding">
          <GenericButton class="w-full" @click="clearsuperseding"> Change Superseding Record </GenericButton>
          <NuxtLink :to="`/masterrecords/${superseding.id}`">
            <masterrecordsRecordCard
              class="mt-4"
              :record="superseding"
              :label="`Superseding Record ${superseding.id.toString()}`"
              :highlight="highlightSections"
            />
          </NuxtLink>
        </div>
        <div v-else>
          <EmpiSearch v-if="searchingFor === 'superseding'" :only-ukrdc="true" @select="selectsuperseding" />
          <GenericButton v-else class="w-full" @click="searchingFor = 'superseding'">
            Search for a Record
          </GenericButton>
        </div>
      </div>
    </div>

    <GenericAlertWarning v-if="mergeBlockDescription" class="mb-4" :message="mergeBlockDescription" />

    <GenericAlertError
      v-if="highlightSections.length > 0"
      class="mb-4"
      :message="`You are about to merge records with mismatching demographics for: ${highlightSections.join(', ')}`"
    />

    <div v-if="readyToMerge">
      <div class="mb-6">
        <TextH2 class="mb-2">Merge Details</TextH2>
        <TextP
          >Master Record <TextL1c class="inline">{{ supersededId }}</TextL1c> will be merged into Master Record
          <TextL1c class="inline">{{ supersedingId }}</TextL1c
          >.
        </TextP>
        <TextP
          >Demographic data on record <TextL1c class="inline">{{ supersededId }}</TextL1c> will be replaced by
          demographic data from record <TextL1c class="inline">{{ supersedingId }}</TextL1c
          >.</TextP
        >
        <TextP
          >All Patient Records linked to Master Record <TextL1c class="inline">{{ supersededId }}</TextL1c> will be
          re-linked to Master Record <TextL1c class="inline">{{ supersedingId }}</TextL1c
          >.</TextP
        >
      </div>

      <div class="flex gap-2">
        <GenericButton :primary="true" colour="red" @click="beginMergeAlert.show()">Begin Record Merge</GenericButton>
        <GenericButton v-if="callbackPath" :to="callbackPath">Cancel</GenericButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, useContext, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { defineComponent, onMounted } from '@vue/composition-api'

import useQuery from '~/helpers/query/useQuery'
import fetchEMPI from '~/helpers/fetch/fetchEMPI'
import fetchMasterRecords from '@/helpers/fetch/fetchMasterRecords'

import { modalInterface } from '~/interfaces/modal'
import { MasterRecord } from '~/interfaces/masterrecord'

enum Direction {
  superseding = 'superseding',
  Superceeded = 'superseded',
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { $toast } = useContext()
    const { stringQuery } = useQuery()
    const { PostEMPIMerge } = fetchEMPI()
    const { fetchMasterRecord } = fetchMasterRecords()

    // Modals

    const beginMergeAlert = ref<modalInterface>()

    // Data refs

    const supersededId = stringQuery('superseded', null, true, false)
    const supersedingId = stringQuery('superseding', null, true, false)
    const callbackPath = stringQuery('callback', null)

    const superseded = ref<MasterRecord>()
    const superseding = ref<MasterRecord>()

    const searchingFor = ref<Direction>()

    const readyToMerge = computed(() => {
      return superseded.value?.id && superseding.value?.id && superseded.value?.id !== superseding.value?.id
    })

    const mergeBlockDescription = computed(() => {
      if (superseded.value?.id && superseding.value?.id) {
        if (superseded.value?.id === superseding.value?.id) {
          return 'A record cannot be merged into itself. Please select a different record on one side.'
        }
        if (superseded.value?.nationalidType !== superseding.value?.nationalidType) {
          return `You are about to merge a ${superseded.value?.nationalidType} record into a ${superseding.value?.nationalidType} record.`
        }
      }
      return ''
    })

    // Data fetching
    async function fetchRecords() {
      if (supersededId.value) {
        superseded.value = await fetchMasterRecord(supersededId.value)
      }
      if (supersedingId.value) {
        superseding.value = await fetchMasterRecord(supersedingId.value)
      }
    }

    onMounted(() => {
      fetchRecords()
    })

    watch([supersededId, supersedingId], () => {
      fetchRecords()
    })

    // Record card style

    const highlightSections = computed<string[]>(() => {
      if (!(superseding.value && superseded.value)) {
        return []
      }
      const highlight = []
      if (
        superseding.value.givenname !== superseded.value.givenname ||
        superseding.value.surname !== superseded.value.surname
      ) {
        highlight.push('name')
      }
      if (superseding.value.dateOfBirth !== superseded.value.dateOfBirth) {
        highlight.push('dateOfBirth')
      }
      if (superseding.value.gender !== superseded.value.gender) {
        highlight.push('gender')
      }
      return highlight
    })

    // Edit merge functions

    function switchRecords() {
      const newQuery = Object.assign({}, route.value.query)
      newQuery.superseded = [supersedingId.value]
      newQuery.superseding = [supersededId.value]
      router.push({
        path: route.value.path,
        query: newQuery,
      })
    }

    function clearMerge() {
      superseding.value = undefined
      superseded.value = undefined
      searchingFor.value = undefined
      const newQuery = Object.assign({}, route.value.query)
      newQuery.superseded = [null]
      newQuery.superseding = [null]
      router.push({
        path: route.value.path,
        query: newQuery,
      })
    }

    function clearsuperseding() {
      superseding.value = undefined
      supersedingId.value = null
      searchingFor.value = Direction.superseding
    }

    function clearSuperceeded() {
      superseded.value = undefined
      supersededId.value = null
      searchingFor.value = Direction.Superceeded
    }

    function selectsuperseding(id: string) {
      supersedingId.value = id
    }

    function selectSuperceeded(id: string) {
      supersededId.value = id
    }

    // Do merge

    function requestMerge() {
      if (superseded.value && superseding.value) {
        PostEMPIMerge(superseded.value.id, superseding.value.id)
          .then(() => {
            $toast.show({
              type: 'success',
              title: 'Success',
              message: 'Record merge request sent successfully',
              timeout: 10,
              classTimeout: 'bg-green-600',
            })
            clearMerge()
            if (callbackPath.value) {
              router.push(callbackPath.value)
            }
          })
          .finally(() => {
            const el = beginMergeAlert.value as modalInterface
            el.hide()
          })
      }
    }

    return {
      beginMergeAlert,
      supersededId,
      supersedingId,
      callbackPath,
      superseded,
      superseding,
      searchingFor,
      highlightSections,
      clearsuperseding,
      clearSuperceeded,
      selectsuperseding,
      selectSuperceeded,
      switchRecords,
      readyToMerge,
      mergeBlockDescription,
      requestMerge,
    }
  },
})
</script>
