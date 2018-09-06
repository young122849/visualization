import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import store, { RootState } from '@/store';
import ProjectService from '@/services/project.service';
import { Project } from '@/models/project';
let service = ProjectService.getInstance()

export interface ProjectState {
  projects: Project[],
}
export const state: ProjectState = {
  projects: []
}
const namespaced: boolean = true

const actions: ActionTree<ProjectState, RootState> = {
  loadProjects({ commit }) {
    service.loadProjects('http://localhost:3000/projects')
      .subscribe(val => {
        commit('getProjects', val.data)
      })
  },
  addProject({ commit }, payload) {
    service.addProject('http://localhost:3000/projects', payload)
      .subscribe(val => commit('addProject', val.data))
  },
  delProject({ commit }, payload) {
    service.delProject('http://localhost:3000/projects', payload)
      .subscribe(val => {
        if ((val.data as any).ok === 1) {
          commit('delProject', payload)
        }
      })
  },
  updateProject({ commit }, payload) {
    service.updateProject(`http://localhost:3000/projects/${payload._id}`, payload).subscribe(val => {
      commit('updateProject', payload)
    })
  }
}

const mutations: MutationTree<ProjectState> = {
  getProjects(store, payload) {
    store.projects = payload
  },
  addProject(store, payload) {
    store.projects.push(payload)
  },
  delProject(store, payload) {
    store.projects.splice(store.projects.findIndex(item => item._id === payload), 1)
  },
  updateProject(store, payload) {
    console.log(payload)
    store.projects.splice(store.projects.findIndex(item => item._id === payload._id), 1, payload)
  }
}

const getters: GetterTree<ProjectState, RootState> = {
  // fetchToken(store) {
  //   return store.token
  // },
  projects(store) {
    return store.projects
  }
}

export const projects: Module<ProjectState, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
  getters
}