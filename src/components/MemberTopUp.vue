<template>
    <v-flex xs12>
        <v-flex xs6>{{$t('lang.member.topup')}}</v-flex>
        <template v-for="(topup, index) in topups">
            <div :key="topup.id" v-if="item.SVYDataMemberTopUps[index] && (!isSummary || (isSummary && item.SVYDataMemberTopUps[index].Selected))">
              <v-layout row>
                  <v-flex xs9>
                  <v-checkbox :disabled="topupReadOnly" hide-details
                      :label="topup.text"
                      v-model="item.SVYDataMemberTopUps[index].Selected">
                  </v-checkbox>
                  </v-flex>
                  <v-flex xs3 pt-2 right v-bind:class="{ 'topupSelected': item.SVYDataMemberTopUps[index].Selected}">
                  {{item.SVYDataMemberTopUps[index].Amount}}
                  </v-flex>
              </v-layout>
            </div>
        </template>
    </v-flex>
</template>

<script>
import i18n from '../locales/index'
import api from '../utils/backend-api'
export default {
  components: {
  },
  data() {
    return {
    }
  },
  props: [
    'item',
    'index',
    'plans',
    'topupReadOnly',
    'isSummary'
  ],
  methods: {
    validate() {
      return this.$refs.form.validate()
    }
  },
  computed: {
    isTopupMember() {
      let name = this.$store.state.survey.surveySteps[
        this.$store.state.step - 1
      ].name
      return name == 'lang.topup.step' && this.item.BasicPlanID == null
    },
    isSummaryMember() {
      let name = this.$store.state.survey.surveySteps[
        this.$store.state.step - 1
      ].name
      return name == 'lang.summary.step' && this.item.BasicPlanID == null
    },
    basicPlans() {
      var plan = this.plans.find(p => p.type == this.item.FamilyCode)
      return plan ? plan.children.filter(p => p.type == 'Basic') : null
    },
    topupPlans() {
      return this.$store.state.plan.basicPlan.Plans.filter(
        p => p.children && p.children[0].type != 'Basic'
      )
    },
    topups() {
      var plan =
        this.isTopupMember || this.isSummaryMember
          ? this.topupPlans
          : this.basicPlans

      var selectedPlan = plan
        ? plan.filter(
            b =>
              this.isTopupMember || this.isSummaryMember
                ? b.type == this.item.FamilyCode
                : b.id == this.item.BasicPlanID
          )
        : null
      return selectedPlan && selectedPlan.length > 0
        ? selectedPlan[0].children
        : null
    },
    ifSummaryPage(index) {
      if(this.isSummary)
      {
      if(this.item.SVYDataMemberTopUps[index].Selected)
      return true
      else 
      return false
      }
      else
      return true
    }
  }
}
</script>

<style>
.topupSelected {
  color: #80d8ff;
}
</style>
