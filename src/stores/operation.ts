import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import store, { RootState } from '@/store';
import UserService, { User } from '@/services/user.service';
import { pluck } from 'rxjs/operators';
let service = new UserService()

export interface UserState {
  status: boolean,
  user: string
}
export const state: UserState = {
  user: '',
  status: false
}
const namespaced: boolean = true

const actions: ActionTree<UserState, RootState> = {
  login({ commit }, payload: User) {
    service.login('http://localhost:3000/session', payload)
      .pipe(pluck('data')).subscribe((res: any) => {
        if (res.success === true) {
          localStorage.setItem('token', res.data.token)
          commit('getUser', res)
        } else {

        }
      })
  },
  // logout({ commit }) {
  //   commit('getUser', { status: false, user: '' })
  //   // localStorage.removeItem('token')
  // }
}

const mutations: MutationTree<UserState> = {
  getUser(store, payload) {
    store.status = payload.success
    store.user = payload.data.username
  },
  logout(store) {
    store.status = false
    store.user = ""
    localStorage.removeItem('token')
  }
}

const getters: GetterTree<UserState, RootState> = {
  // fetchToken(store) {
  //   return store.token
  // },
  status(store) {
    return store.status
  },
  user(store) {
    return store.user
  }
}

export const operation: Module<UserState, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
  getters
}