import { GetterTree, MutationTree } from "vuex";

interface UserPrefs {
  searchShowUKRDC: boolean;
}

export const state = () => ({
  prefs: {
    searchShowUKRDC: false,
  } as UserPrefs,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  searchShowUKRDC: (state) => state.prefs.searchShowUKRDC,
};

export const mutations: MutationTree<RootState> = {
  changeSearchShowUKRDC: (state, newValue: boolean) => (state.prefs.searchShowUKRDC = newValue),
};
