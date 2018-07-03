import Vue from 'vue'
import Vuex from 'vuex'
import SurveyIntroduction from '../../components/SurveyIntroduction'
import FamilyInput from '../../components//FamilyInput'
import EmployeeChoice from '../../components//EmployeeChoice'
import Topup from '../../components//TopUp'
import SurveySummary from '../../components//SurveySummary'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  surveyHeader: null,
  surveyContent: null,
  surveySteps: [],
  surveySubmittedDate: null
}

const actions = {
  updateSurveyHeader({
    commit
  }, surveyHeader) {
    commit('setSurveyHeader', surveyHeader)

    if (surveyHeader) {
      var steps = [{
          name: 'lang.start.step',
          prevButton: 'lang.start.prevButton',
          nextButton: 'lang.start.nextButton',
          component: SurveyIntroduction
        },
        {
          name: 'lang.familyInfo.step',
          prevButton: 'lang.familyInfo.prevButton',
          nextButton: 'lang.familyInfo.nextButton',
          component: FamilyInput
        }
      ]

      if (surveyHeader.SVY_SKIPSTEP_PLANBASIC != true) {
        steps.push({
          name: 'lang.basicPlan.step',
          prevButton: 'lang.basicPlan.prevButton',
          nextButton: 'lang.basicPlan.nextButton',
          component: EmployeeChoice
        })
      }

      if (surveyHeader.SVY_SKIPSTEP_PLANTOPUP != true) {
        steps.push({
          name: 'lang.topup.step',
          prevButton: 'lang.topup.prevButton',
          nextButton: 'lang.topup.nextButton',
          component: Topup
        })
      }

      steps.push({
        name: 'lang.summary.step',
        prevButton: 'lang.summary.prevButton',
        nextButton: 'lang.summary.nextButton',
        component: SurveySummary
      })

      commit('setSurveySteps', steps)
    }
  },
  updateSurveyConent({
    commit
  }, surveyContent) {
    commit('setSurveyContent', surveyContent)
  },
  updateSurveySubmittedDate({
    commit
  }, submittedDate) {
    commit('setSurveySubmittedDate', submittedDate)
  }
}

const mutations = {
  setSurveyHeader(state, surveyHeader) {
    state.surveyHeader = surveyHeader
  },
  setSurveyContent(state, surveyContent) {
    state.surveyContent = surveyContent
  },
  setSurveySteps(state, steps) {
    state.surveySteps = steps
  },
  setSurveySubmittedDate(state, submittedDate) {
    state.surveySubmittedDate = submittedDate
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
