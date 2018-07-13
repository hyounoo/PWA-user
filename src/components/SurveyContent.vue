<template>
  <div>
    <v-stepper v-model="$store.state.step" v-if="$store.state.survey.surveySteps.length > 0">
      <v-stepper-header>
        <template v-if="!completed" v-for="n in $store.state.survey.surveySteps.length" >          
          <v-stepper-step
            v-if="$store.state.survey.surveySteps[n - 1]"
            :key="`${n}-step`"
            :step="n"
            :complete="$store.state.step > n">            
            <span v-t="$store.state.survey.surveySteps[n - 1].name"></span>
          </v-stepper-step>            
          <v-divider v-if="n !== $store.state.survey.surveySteps.length" :key="n"></v-divider>
        </template>
      </v-stepper-header>
      <v-card v-if="!completed" class="elevation-1 hidden-md-and-up">
        <v-card-text class="pa-0">
          <v-layout row>
            <v-flex xs12 text-xs-center title>
              <span v-if="$store.state.survey.surveySteps.length > 0" v-t="$store.state.survey.surveySteps[$store.state.step - 1].name"></span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-stepper-items>
        <v-stepper-content :step="n" v-for="n in $store.state.survey.surveySteps.length" :key="`${n}-content`" class="px-2" >
          <component v-if="!completed" v-bind:is="$store.state.survey.surveySteps[n-1].component" ref="contentComponent" class="mb-3"></component>
          <div v-show="!$store.state.loading" v-if="!surveyEnd && !surveyNotStarted">
            <v-btn color="primary" @click="restart()" v-show="n == $store.state.survey.surveySteps.length && $store.state.survey.surveySubmittedDate && $store.state.survey.surveyHeader.SVY_SURVEYSTATUSCODE == 'SST_TEMP_STARTED'">              
              {{$t('lang.summary.restart')}}
            </v-btn>
            <v-btn flat @click="prevStep(n)" v-show="n != 1 && !$store.state.survey.surveySubmittedDate">
              <span v-t="$store.state.survey.surveySteps[$store.state.step - 1].prevButton"></span>
            </v-btn>
            <v-btn color="primary" @click="complete()" v-show="n == $store.state.survey.surveySteps.length && !$store.state.survey.surveySubmittedDate">
              <span v-t="$store.state.survey.surveySteps[$store.state.step - 1].nextButton"></span>
            </v-btn>
            <v-btn color="primary" @click="nextStep(n)" v-show="n != $store.state.survey.surveySteps.length && $store.state.plan.basicPlan.Plans.length != 0">
              <span v-t="$store.state.survey.surveySteps[$store.state.step - 1].nextButton"></span>
            </v-btn>
          </div>          
        </v-stepper-content>
      </v-stepper-items>      
      <!-- <v-speed-dial v-if="!$store.state.loading && $store.state.step > 1"
        v-model="$store.state.fab" :bottom="bottom" :right="right" :direction="direction" :transition="transition">
          <v-btn small
            slot="activator" v-model="$store.state.fab"
            color="blue darken-2" dark fab hover>
            <v-icon>account_circle</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn v-if="currentStepName == 'lang.familyInfo.step' && canAdd"
            dark fab small color="indigo" @click="addItem()">
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn v-if="currentStepName == 'lang.topup.step' && canAddTopupMember"
            dark fab small color="indigo" @click="addItem()">
            <v-icon>add</v-icon>
          </v-btn>
        </v-speed-dial> -->
      <v-snackbar v-if="!$store.state.loading"
        :timeout="timeout"
        :top="y === 'top'"
        :bottom="y === 'bottom'"
        :right="x === 'right'"
        :left="x === 'left'"
        :multi-line="mode === 'multi-line'"
        :vertical="mode === 'vertical'"
        v-model="snackbar">
        <span large v-t="'lang.saveCompleted'"></span>
        <v-btn flat color="red" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-stepper>    
  </div>
</template>

<script>
import i18n from '../locales/index'
import api from '../utils/backend-api'
import SurveyIntroduction from './SurveyIntroduction'
import FamilyInput from './FamilyInput'
import EmployeeChoice from './EmployeeChoice'
import Topup from './TopUp'
import SurveySummary from './SurveySummary'

export default {
  components: {
    SurveyIntroduction,
    FamilyInput,
    EmployeeChoice,
    Topup,
    SurveySummary
  },
  data() {
    return {
      snackbar: false,
      y: 'bottom',
      x: null,
      mode: '',
      timeout: 4000,
      fab: false,
      direction: 'top',
      right: true,
      bottom: true,
      transition: 'slide-y-reverse-transition',
      completed: false,
      startDate: Date.parse(
        this.$store.state.survey.surveyHeader.SVY_SURVEYSTARTDATE
      ),
      endDate: Date.parse(
        this.$store.state.survey.surveyHeader.SVY_SURVEYENDDATE
      )
    }
  },
  computed: {
    surveyNotStarted() {
      return this.startDate >= Date.now()
    },
    surveyEnd() {
      return this.endDate <= Date.now()
    },
    plans() {
      return this.$store.state.plan.basicPlan.Plans
    },
    allFamilyInfoValid() {
      return (
        this.$store.state.family.members.filter(
          b => b.MemberName.length == 0 || b.SSN.length == 0
        ).length == 0
      )
    },
    currentStepName() {
      return this.$store.state.survey.surveySteps[this.$store.state.step - 1]
        .name
    },
    canAdd() {
      return true
    },
    canAddTopupMember() {
      return true
    }
  },
  methods: {
    nextStep(n) {
      this.scrollToTop();

      this.$store.state.fab = false

      if (this.currentStepName == 'lang.familyInfo.step') {
        if (
          !this.$refs.contentComponent[n - 1].validate() ||
          !this.allFamilyInfoValid
        ) {
          Store.state.error = true
          Store.state.errorText = i18n.tc('lang.validation.familyInfo')
          return
        }
        var employee = this.$store.state.family.members.find(
          m => m.FamilyCode == 'FMM_EMPLOYEE'
        )

        if (!employee) {
          console.log('validate :', 'No employee')
          Store.state.error = true
          Store.state.errorText = i18n.tc('lang.validation.missingEmployee')
          return
        }
      }

      if (this.currentStepName == 'lang.basicPlan.step') {
        var plans = this.plans.filter(
          p => p.children && p.children[0].type == 'Basic'
        )

        var candidate = []

        this.$store.state.family.members.forEach(member => {
          var plan = plans.find(p => p.type == member.FamilyCode)
          if (plan) candidate.push(member)
        })

        if (candidate.filter(b => b.BasicPlanID == null).length != 0) {
          Store.state.error = true
          Store.state.errorText = 'lang.validation.missingBasicPlans'
          return
        }
      }

      if (this.currentStepName == 'lang.topup.step') {
        if (
          !this.$refs.contentComponent[n - 1].validate() ||
          !this.allFamilyInfoValid
        ) {
          Store.state.error = true
          Store.state.errorText = 'lang.validation.familyInfo'
          return
        }
        var noTopupFound = false
        var topupMembers = this.$store.state.family.members.filter(
          m => m.BasicPlanID == null
        )

        topupMembers.forEach(member => {
          var notSelected = member.SVYDataMemberTopUps.find(
            s => s.Selected == false
          )

          if (notSelected) {
            noTopupFound = true
          }
        })

        if (noTopupFound) {
          console.log('this.currentStepName :', this.currentStepName)
          Store.state.error = true
          Store.state.errorText = 'lang.validation.missingTopupSelection'
          return
        }
      }
      this.$store.dispatch('updateSurveyStep', n + 1)
    },
    prevStep(n) {
      this.scrollToTop();
      
      this.$store.dispatch('updateSurveyStep', n - 1)
      this.$store.state.fab = false
    },
    complete() {
      this.scrollToTop();

      //saveMembers
      this.$store.dispatch('setLoadingStatus', true)
      api.postData('newapi/saveMembers', this.$store.state.family.members).then(
        res => {
          this.$store.dispatch('family/updateMembers', res.data)
          this.$store.dispatch('setLoadingStatus', false)
          this.snackbar = true
          this.$store.dispatch('survey/updateSurveySubmittedDate', Date.now)
          this.completed = true
        },
        err => {
          console.log(err)
          this.$store.dispatch('setLoadingStatus', false)
        }
      )
    },
    restart() {
      this.scrollToTop();
      this.completed = false
      this.$store.dispatch('survey/updateSurveySubmittedDate', null)
      this.$store.dispatch('updateSurveyStep', 1)
    },
    updateMembers() {
      console.log('updating members...')
      var vm = this
      this.$store.state.family.members.forEach(function(member) {
        var basicPlan = vm.plans.find(p => p.type == member.FamilyCode)

        if (basicPlan) {
          var basicPlanChildren = basicPlan.children.find(
            b => b.id == member.BasicPlanID
          )

          var topupPlanChildren = basicPlan.children

          var topups = []
          if (basicPlanChildren) {
            basicPlanChildren.children.forEach(function(topup, index) {
              topups.push({
                TopupPlanID: topup.id,
                Amount: null,
                TopupPlanPremiumID: null,
                Selected:
                  member.SVYDataMemberTopUps != null &&
                  member.SVYDataMemberTopUps.find(
                    t => t.TopupPlanID == topup.id
                  )
              })
            }, this)
          } else if (topupPlanChildren) {
            topupPlanChildren.forEach(function(topup, index) {
              topups.push({
                TopupPlanID: topup.id,
                Amount: null,
                TopupPlanPremiumID: null,
                Selected:
                  member.SVYDataMemberTopUps != null &&
                  member.SVYDataMemberTopUps.find(
                    t => t.TopupPlanID == topup.id
                  )
              })
            }, this)
          }

          member.SVYDataMemberTopUps = topups

          //Calculate age
          var insuranceStartDate = new Date(
            this.$store.state.survey.surveyHeader.SVY_INSURANCESTARTDATEFORCALC
          )

          member.Age = this.appUtil.calculateAge(
            this.appUtil.getDateOfBirth(member.SSN),
            insuranceStartDate
          )
          member.Sex = this.appUtil.GetGender(member.SSN)
        }
      }, this)

      this.$store.dispatch('setLoadingStatus', true)
      api.postData('newapi/getMembers', this.$store.state.family.members).then(
        res => {
          this.$store.dispatch('family/updateMembers', res.data)
          this.$store.dispatch('setLoadingStatus', false)
        },
        err => {
          console.log(err)
          this.$store.dispatch('setLoadingStatus', false)
        }
      )
    },
    addItem() {
      var member = {
        BasicPlanID: null,
        FamilyCode: null,
        IsForeigner: false,
        MemberName: '',
        SSN: '',
        SVYDataMemberID: null,
        SVYDataMemberTopUps: []
      }
      this.$store.dispatch('family/addMember', member)
    },
    addTopupMemberItem() {},
    scrollToTop() {
      this.$vuetify.goTo(0, { "duration": 300, "offset": 0, "easing": "easeInOutCubic" })
    }
  },
  updated() {
    console.log('updated :', Store.state.step)
  },
  created() {
    var vm = this
    this.$store.watch(this.$store.getters.getStep, n => {
      if (
        vm.currentStepName == 'lang.topup.step' ||
        (vm.currentStepName == 'lang.summary.step' &&
          Store.state.survey.surveySubmittedDate)
      ) {
        vm.updateMembers()
      }
    })
  },
  mounted() {
    console.log('mounted :', 'content')
    if (
      this.currentStepName == 'lang.summary.step' &&
      Store.state.survey.surveySubmittedDate
    ) {
      this.updateMembers()
    }
  }
}
</script>


<style scoped>
#survey .speed-dial {
  position: fixed;
  right: 5px;
  bottom: 40px;
  z-index: 5;
}

#survey .btn--floating {
  position: relative;
}
</style>