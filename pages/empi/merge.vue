<template>
  <div>
    <GenericModalConfirm
      ref="beginMergeAlert"
      title="Begin Record Merge"
      message="Are you sure you want to begin merging these records?"
      icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      :danger="true"
      @confirm=""
    />

    <div class="max-w-7xl mx-auto mb-4">
      <TextH1>Merge Records</TextH1>
    </div>

    <div class="block lg:flex gap-2 mb-6">
      <div class="flex-1">
        <div v-if="superceeded">
          <GenericButton class="w-full" @click="clearSuperceeded"> Change Superceeded Record </GenericButton>
          <masterrecordsRecordCard
            class="mt-4 border-2 border-indigo-500"
            :record="superceeded"
            :label="`Superceeded ${superceeded.id.toString()}`"
          />
        </div>
        <div v-else>
          <EmpiSearch v-if="searchingFor === 'superceeded'" @select="selectSuperceeded" />
          <GenericButton v-else class="w-full" @click="searchingFor = 'superceeded'">
            Search for a Record
          </GenericButton>
        </div>
      </div>

      <div class="flex-none h-8 lg:w-8 mb-2">
        <button v-tooltip="'Switch Records'" class="block mx-auto" @click="switchRecords">
          <IconSwitchH class="hidden lg:block" /><IconSwitchV class="block lg:hidden" />
        </button>
      </div>

      <div class="flex-1">
        <div v-if="superceeding">
          <GenericButton class="w-full" @click="clearSuperceeding"> Change Superceeding Record </GenericButton>
          <masterrecordsRecordCard
            class="mt-4 border-2 border-indigo-500"
            :record="superceeding"
            :label="`Superceeding ${superceeding.id.toString()}`"
          />
        </div>
        <div v-else>
          <EmpiSearch v-if="searchingFor === 'superceeding'" @select="selectSuperceeding" />
          <GenericButton v-else class="w-full" @click="searchingFor = 'superceeding'">
            Search for a Record
          </GenericButton>
        </div>
      </div>
    </div>

    <GenericAlertWarning v-if="mergeBlockDescription" :message="mergeBlockDescription" />

    <div v-if="readyToMerge">
      <div class="mb-6">
        <TextH2 class="mb-2">Merge Details</TextH2>
        <TextP
          >Master Record <TextL1c class="inline">{{ superceededId }}</TextL1c> will be merged into Master Record
          <TextL1c class="inline">{{ superceedingId }}</TextL1c
          >.
        </TextP>
        <TextP
          >Demographic data on record <TextL1c class="inline">{{ superceededId }}</TextL1c> will be replaced by
          demographic data from record <TextL1c class="inline">{{ superceedingId }}</TextL1c
          >.</TextP
        >
        <TextP
          >All Patient Records linked to Master Record <TextL1c class="inline">{{ superceededId }}</TextL1c> will be
          re-linked to Master Record <TextL1c class="inline">{{ superceedingId }}</TextL1c
          >.</TextP
        >
      </div>
      <GenericButton colour="red" @click="beginMergeAlert.show()">Begin Record Merge</GenericButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, Ref, ref, useContext, useFetch, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { defineComponent } from '@vue/composition-api'
import { modalInterface } from '@/interfaces/modal'
import { MasterRecord } from '~/interfaces/masterrecord'
import useQuery from '~/mixins/useQuery'

enum Direction {
  Superceeding = 'superceeding',
  Superceeded = 'superceeded',
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { $axios, $config } = useContext()
    const { stringQuery } = useQuery()

    const beginMergeAlert = ref<modalInterface>()

    const superceededId = stringQuery('superceeded', null, true, false)
    const superceedingId = stringQuery('superceeding', null, true, false)

    const superceeded = ref<MasterRecord>()
    const superceeding = ref<MasterRecord>()

    const searchingFor = ref<Direction>()

    const readyToMerge = computed(() => {
      return superceeded.value?.id && superceeding.value?.id && superceeded.value?.id !== superceeding.value?.id
    })

    const mergeBlockDescription = computed(() => {
      if (superceeded.value?.id || superceeding.value?.id) {
        if (superceeded.value?.id === superceeding.value?.id) {
          return 'A record cannot be merged into itself. Please select a different record on one side.'
        }
      }
      return ''
    })

    function switchRecords() {
      const newQuery = Object.assign({}, route.value.query)
      newQuery.superceeded = [superceedingId.value]
      newQuery.superceeding = [superceededId.value]
      router.push({
        path: route.value.path,
        query: newQuery,
      })
    }

    function clearSuperceeding() {
      superceeding.value = undefined
      superceedingId.value = null
      searchingFor.value = Direction.Superceeding
    }

    function clearSuperceeded() {
      superceeded.value = undefined
      superceededId.value = null
      searchingFor.value = Direction.Superceeded
    }

    function selectSuperceeding(id: string) {
      superceedingId.value = id
    }

    function selectSuperceeded(id: string) {
      superceededId.value = id
    }

    async function fetchRecord(id: string, ouput: Ref) {
      const path = `${$config.apiBase}/v1/masterrecords/${id}/`
      const res: MasterRecord = await $axios.$get(path)
      ouput.value = res
    }

    const { fetch } = useFetch(async () => {
      await Promise.all([
        superceededId.value ? fetchRecord(superceededId.value, superceeded) : null,
        superceedingId.value ? fetchRecord(superceedingId.value, superceeding) : null,
      ])
    })

    watch([superceededId, superceedingId], () => {
      fetch()
    })

    return {
      beginMergeAlert,
      superceededId,
      superceedingId,
      superceeded,
      superceeding,
      searchingFor,
      clearSuperceeding,
      clearSuperceeded,
      selectSuperceeding,
      selectSuperceeded,
      switchRecords,
      readyToMerge,
      mergeBlockDescription,
    }
  },
})
</script>
