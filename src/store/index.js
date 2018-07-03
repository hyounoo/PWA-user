import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'

import user from './modules/user'
import survey from './modules/survey'
import family from './modules/family'
import plan from './modules/plan'
import i18n from '../locales'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    showHeader: true,
    fab: false,
    hideSSN: true,
    step: null,
    error: false,
    errorText: ''
  },
  getters: {
    getStep: state => () => state.step
  },
  actions: {
    setLoadingStatus(context, status) {
      context.commit('setLoading', status)
    },
    switchI18n({
      commit
    }, lang) {
      commit('setI18n', lang)
    },
    updateSurveyStep({
      commit
    }, step) {
      commit('setSurveyStep', step)
    }
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status
    },
    setI18n(state, lang) {
      i18n.locale = lang
    },
    setSurveyStep(state, step) {
      state.step = step
    }
  },
  modules: {
    user,
    survey,
    family,
    plan
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    }),
    createMutationsSharer({
      predicate: ['user/setUser', 'user/setToken']
    })
  ]
})
