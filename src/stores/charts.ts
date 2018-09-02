import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import store, { RootState } from '@/store';
import { pluck } from 'rxjs/operators';
import ChartService from '@/services/chart.service';
let service = new ChartService()

export interface ChartState {
  type: string,
  data: any[],
  selected: any[]
  titles: string[]
}
export const state: ChartState = {
  type: '',
  data: [],
  selected: [],
  titles: []
}
const namespaced: boolean = true

const actions: ActionTree<ChartState, RootState> = {
  loadData({ commit }, payload) {
    service.loadData(payload.url, payload.type).subscribe((val: any) => {
      val.data.type = payload.type
      commit('loadData', val.data)
    })
  }
}

const mutations: MutationTree<ChartState> = {
  loadData(store, payload) {
    store.type = payload.type
    store.data = [...payload]
    store.titles = Object.keys(store.data[0])
  },
  loadSelected(store, payload) {
    store.selected = payload
  }
}

const getters: GetterTree<ChartState, RootState> = {
  loadData(store) {
    return store.data
  },
  loadSelected(store) {
    return store.selected
  },
  loadTitles(store) {
    return store.titles
  }
}

export const charts: Module<ChartState, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
  getters
}