import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  basicPlan: null
}

const actions = {
  updateBasicPlan({ commit }, basicPlan) {
    commit('setBasicPlan', basicPlan)
  }
}

const mutations = {
  setBasicPlan(state, basicPlan) {
    state.basicPlan = basicPlan
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
