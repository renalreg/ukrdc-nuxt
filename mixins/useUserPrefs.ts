import { computed, useStore } from '@nuxtjs/composition-api'

export default function () {
  const store = useStore()

  const showUKRDC = computed({
    get: () => {
      return store.getters.searchShowUKRDC
    },
    set: (newValue: boolean) => {
      store.commit('changeSearchShowUKRDC', newValue)
    },
  })

  return {
    showUKRDC,
  }
}
