<template>
  <v-form v-model="valid" ref="form" lazy-validation>    
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs5 text-xs-center>
            <member-name
              :item="item" :familyInfoReadyOnly="familyInfoReadyOnly"></member-name>
              <member-relationship
              :item="item" :plans="plans" :familyInfoReadyOnly="familyInfoReadyOnly" :isSummary="isSummary"></member-relationship>
          </v-flex>
          <v-flex xs7 v-if="currentStepName != 'lang.basicPlan.step'">
            <member-SSN
              :item="item" :plans="plans" :familyInfoReadyOnly="familyInfoReadyOnly" :isSummary="isSummary"></member-SSN>
          </v-flex>
          <v-flex xs3 pt-2 v-if="deleteShow || isTopupMember">
            <v-btn icon @click="deleteItem(index)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row v-if="basicPlanShow && basicPlans && basicPlans.length > 0">
            <member-basic-plans
              :item="item" :plans="plans" :basicPlanReadOnly="basicPlanReadOnly" :isSummary="isSummary"></member-basic-plans>
        </v-layout>
        <v-layout row v-if="topupShow && topups && topups.length > 0 && item.SVYDataMemberTopUps && item.SVYDataMemberTopUps.length > 0">
            <member-top-up
              :item="item" :plans="plans" :topupReadOnly="topupReadOnly" :isSummary="isSummary"></member-top-up>
        </v-layout>      
        <v-layout row v-if="premiumShow && topupShow && topups && topups.length > 0 && item.SVYDataMemberTopUps && item.SVYDataMemberTopUps.length > 0">
          <v-flex>
              <member-total
              :item="item"></member-total>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog">      
      <v-card v-if="memberToDelete !== undefined">
        <v-card-title class="headline">{{$t('lang.confirmation.memberEdit')}}</v-card-title>
        <v-card-text>
          <span>
            {{$t('lang.confirmation.deleteMember')}}
          </span> 
          <br>
          <span>
            {{$t('lang.member.name')}} : {{this.$store.state.family.members[memberToDelete].MemberName}}
          </span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat="flat" @click="deleteConfirm">{{$t('lang.confirmation.delete')}}</v-btn>
          <v-btn color="black darken-1" flat="flat" @click.native="dialog = false">{{$t('lang.confirmation.cancel')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import i18n from '../locales/index'
import api from '../utils/backend-api'
import MemberRelationship from './MemberRelationship'
import MemberName from './MemberName'
import MemberSSN from './MemberSSN'
import MemberBasicPlans from './MemberBasicPlans'
import MemberTopUp from './MemberTopUp'
import MemberTotal from './MemberTotal'
export default {
  components: {
    MemberRelationship,
    MemberName,
    MemberSSN,
    MemberBasicPlans,
    MemberTopUp,
    MemberTotal
  },
  data() {
    return {
      valid: true,
      dialog: false,
      memberToDelete: undefined
    }
  },
  props: [
    'item',
    'index',
    'plans',
    'familyInfoReadyOnly',
    'basicPlanReadOnly',
    'basicPlanShow',
    'topupReadOnly',
    'topupShow',
    'premiumShow',
    'deleteShow',
    'isSummary'
  ],
  methods: {
    deleteItem(index) {
      // alert user for delete
      this.memberToDelete = index
      this.dialog = true
    },
    deleteConfirm() {
      if (
        this.$store.state.family.members[this.memberToDelete].FamilyCode ==
        'FMM_EMPLOYEE'
      ) {
        Store.state.error = true
        Store.state.errorText = i18n.tc('lang.validation.cannotRemoveEmployee')
      } else {
        this.dialog = false
        this.$store.dispatch('family/removeMember', this.memberToDelete)
      }
    },
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
    currentStepName() {
      return this.$store.state.survey.surveySteps[this.$store.state.step - 1]
        .name
    }
  }
}
</script>

<style>
.topupSelected {
  color: #80d8ff;
}
</style>
