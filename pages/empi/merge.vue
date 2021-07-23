<template>
  <div>
    <div class="max-w-7xl mx-auto mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Merge Records</h1>
    </div>

    <div class="block lg:flex gap-2 mb-4">
      <div class="flex-1">
        <div v-if="superceeded">
          <GenericButton class="w-full" @click="clearSuperceeded"> Change Superceeded Record </GenericButton>
          <masterrecordsRecordCard
            class="mt-2 border-2 border-indigo-500"
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
            class="mt-2 border-2 border-indigo-500"
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
  </div>
</template>

<script lang="ts">
import { Ref, ref, useContext, useFetch, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { defineComponent } from '@vue/composition-api'
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

    const superceededId = stringQuery('superceeded', null, true, false)
    const superceedingId = stringQuery('superceeding', null, true, false)

    const superceeded = ref<MasterRecord>()
    const superceeding = ref<MasterRecord>()

    const searchingFor = ref<Direction>()

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
    }
  },
})
</script>
