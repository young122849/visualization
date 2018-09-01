import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { operation } from '@/stores/operation'
import { projects } from '@/stores/projects'
import { charts } from '@/stores/charts'
Vue.use(Vuex)

export interface RootState {
  version: string,
  expand: boolean
}
const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
    expand: false
  },
  getters: {
    expand(store) {
      return store.expand
    }
  },
  mutations: {
    expand(store, payload) {
      store.expand = payload
    }
  },
  modules: {
    operation,
    projects,
    charts
  }
}

export default new Vuex.Store<RootState>(store)
