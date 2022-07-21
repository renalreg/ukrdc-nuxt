export default function () {
  const { $store } = useNuxtApp();

  const showUKRDC = computed({
    get: () => {
      return $store.getters.searchShowUKRDC;
    },
    set: (newValue: boolean) => {
      $store.commit("changeSearchShowUKRDC", newValue);
    },
  });

  return {
    showUKRDC,
  };
}
