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
        <div v-if="superceeded">
          <GenericButton class="w-full" @click="clearSuperceeded"> Change Superseded Record </GenericButton>
          <NuxtLink :to="`/masterrecords/${superceeded.id}`">
            <masterrecordsRecordCard
              class="mt-4 border-2 border-indigo-500"
              :record="superceeded"
              :label="`Superseded Record ${superceeded.id.toString()}`"
            />
          </NuxtLink>
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
        <div v-if="superceding">
          <GenericButton class="w-full" @click="clearsuperceding"> Change Superseding Record </GenericButton>
          <NuxtLink :to="`/masterrecords/${superceding.id}`">
            <masterrecordsRecordCard
              class="mt-4 border-2 border-indigo-500"
              :record="superceding"
              :label="`Superseding Record ${superceding.id.toString()}`"
            />
          </NuxtLink>
        </div>
        <div v-else>
          <EmpiSearch v-if="searchingFor === 'superceding'" @select="selectsuperceding" />
          <GenericButton v-else class="w-full" @click="searchingFor = 'superceding'">
            Search for a Record
          </GenericButton>
        </div>
      </div>
    </div>

    <GenericAlertWarning v-if="mergeBlockDescription" class="mb-4" :message="mergeBlockDescription" />

    <div v-if="readyToMerge">
      <div class="mb-6">
        <TextH2 class="mb-2">Merge Details</TextH2>
        <TextP
          >Master Record <TextL1c class="inline">{{ superceededId }}</TextL1c> will be merged into Master Record
          <TextL1c class="inline">{{ supercedingId }}</TextL1c
          >.
        </TextP>
        <TextP
          >Demographic data on record <TextL1c class="inline">{{ superceededId }}</TextL1c> will be replaced by
          demographic data from record <TextL1c class="inline">{{ supercedingId }}</TextL1c
          >.</TextP
        >
        <TextP
          >All Patient Records linked to Master Record <TextL1c class="inline">{{ superceededId }}</TextL1c> will be
          re-linked to Master Record <TextL1c class="inline">{{ supercedingId }}</TextL1c
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
  superceding = 'superceding',
  Superceeded = 'superceeded',
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { $axios, $config, $toast } = useContext()
    const { stringQuery } = useQuery()

    const beginMergeAlert = ref<modalInterface>()

    const superceededId = stringQuery('superceeded', null, true, false)
    const supercedingId = stringQuery('superceding', null, true, false)

    const superceeded = ref<MasterRecord>()
    const superceding = ref<MasterRecord>()

    const searchingFor = ref<Direction>()

    const readyToMerge = computed(() => {
      return superceeded.value?.id && superceding.value?.id && superceeded.value?.id !== superceding.value?.id
    })

    const mergeBlockDescription = computed(() => {
      if (superceeded.value?.id || superceding.value?.id) {
        if (superceeded.value?.id === superceding.value?.id) {
          return 'A record cannot be merged into itself. Please select a different record on one side.'
        }
        if (superceeded.value?.nationalidType !== superceding.value?.nationalidType) {
          return `You are about to merge a ${superceeded.value?.nationalidType} record into a ${superceding.value?.nationalidType} record.`
        }
      }
      return ''
    })

    function switchRecords() {
      const newQuery = Object.assign({}, route.value.query)
      newQuery.superceeded = [supercedingId.value]
      newQuery.superceding = [superceededId.value]
      router.push({
        path: route.value.path,
        query: newQuery,
      })
    }

    function clearMerge() {
      superceding.value = undefined
      superceeded.value = undefined
      searchingFor.value = undefined
      const newQuery = Object.assign({}, route.value.query)
      newQuery.superceeded = [null]
      newQuery.superceding = [null]
      router.push({
        path: route.value.path,
        query: newQuery,
      })
    }

    async function requestMerge() {
      try {
        await $axios.$post(`${$config.apiBase}/v1/empi/merge`, {
          superceding: superceding.value?.id,
          superceeded: superceeded.value?.id,
        })
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'Record merge request sent successfully',
          timeout: 10,
          classTimeout: 'bg-green-600',
        })
        clearMerge()
      } catch (error) {
        console.log(error.response.data.detail)
        $toast.show({
          type: 'danger',
          title: 'Error',
          message: 'Error processing merge request',
          timeout: 10,
          classTimeout: 'bg-red-600',
        })
      }
      const el = beginMergeAlert.value as modalInterface
      el.hide()
    }

    function clearsuperceding() {
      superceding.value = undefined
      supercedingId.value = null
      searchingFor.value = Direction.superceding
    }

    function clearSuperceeded() {
      superceeded.value = undefined
      superceededId.value = null
      searchingFor.value = Direction.Superceeded
    }

    function selectsuperceding(id: string) {
      supercedingId.value = id
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
        supercedingId.value ? fetchRecord(supercedingId.value, superceding) : null,
      ])
    })

    watch([superceededId, supercedingId], () => {
      fetch()
    })

    return {
      beginMergeAlert,
      superceededId,
      supercedingId,
      superceeded,
      superceding,
      searchingFor,
      clearsuperceding,
      clearSuperceeded,
      selectsuperceding,
      selectSuperceeded,
      switchRecords,
      readyToMerge,
      mergeBlockDescription,
      requestMerge,
    }
  },
})
</script>
