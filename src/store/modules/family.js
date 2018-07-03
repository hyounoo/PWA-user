import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  members: []
}

const actions = {
  updateMembers({
    commit
  }, members) {
    //members[0].SVYDataMemberID = 100540
    commit('setMembers', members)
  },
  addMember({
    commit
  }, member) {
    commit('addMember', member)
  },
  removeMember({
    commit
  }, index) {
    commit('removeMember', index)
  }
}

const mutations = {
  setMembers(state, members) {
    state.members = members
  },
  addMember(state, member) {
    state.members.push(member)
  },
  removeMember(state, index) {
    state.members.splice(index, 1)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
