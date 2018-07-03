import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  user: null,
  token: null
}

const actions = {
  updateToken({ commit }, token) {
    commit('setToken', token)
  },
  updateUser({ commit }, user) {
    commit('setUser', user)
  },
  logout({ commit }) {
    commit('setToken', null)
    commit('setUser', {})
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setToken(state, token) {
    state.token = token
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
