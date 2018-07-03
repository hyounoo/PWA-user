<template>
  <v-form v-model="valid" ref="form" lazy-validation>    
    <v-card>
      <v-card-text>
        <v-layout row>
          <v-flex xs6>
            <v-select :label="$t('lang.member.relationship')" 
              :rules="appUtil.memberRules(item)"
              :readonly="familyInfoReadyOnly && !isTopupMember" @change="relationshipChanged" 
              :items="isTopupMember ? topupPlans : plans" v-model="item.FamilyCode" item-text="text" item-value="type">
            </v-select>
          </v-flex>
          <v-flex xs6>
            <v-text-field :label="$t('lang.member.name')" 
              :rules="appUtil.requiredRules($t('lang.member.name'))"
              :readonly="familyInfoReadyOnly && !isTopupMember" :return-value.sync="item.MemberName" v-model="item.MemberName"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs9>
            <v-text-field :label="$t('lang.member.ssn')" @change="ssnChanged"
            :rules="appUtil.ssnRules(item.SSN)"
              :readonly="familyInfoReadyOnly && !isTopupMember" mask="######-#######" 
              v-model="item.SSN" 
              :append-icon-cb="() => (item.SSNVisibility = !item.SSNVisibility)"
              :append-icon="item.SSNVisibility ? 'visibility' : 'visibility_off'"
              :type="item.SSNVisibility ? 'password' : 'text'">
            </v-text-field>
          </v-flex>
          <v-flex xs3 pt-2 v-if="deleteShow || isTopupMember">
            <v-btn icon @click="deleteItem(index)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row v-if="basicPlanShow && basicPlans && basicPlans.length > 0">
          <v-flex xs12>
            <v-flex xs6>{{$t('lang.member.basicPlan')}}</v-flex>
            <v-radio-group v-if="basicPlans"
              v-model="item.BasicPlanID">
              <template 
                v-for="plan in basicPlans">
                <v-radio :disabled="basicPlanReadOnly" :rules="appUtil.requiredRules($t('lang.member.basicPlan'))"
                  :key="plan.id" :label="plan.text" :value="plan.id"></v-radio>
              </template>
            </v-radio-group>
          </v-flex>
        </v-layout>
        <v-layout row v-if="topupShow && topups && topups.length > 0 && item.SVYDataMemberTopUps && item.SVYDataMemberTopUps.length > 0">
          <v-flex xs12>
            <v-flex xs6>{{$t('lang.member.topup')}}</v-flex>
            <template v-for="(topup, index) in topups">
              <div :key="topup.id" v-if="item.SVYDataMemberTopUps[index]">
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
        </v-layout>      
        <v-layout row v-if="premiumShow && topupShow && topups && topups.length > 0 && item.SVYDataMemberTopUps && item.SVYDataMemberTopUps.length > 0">
          <v-flex>
            <v-layout row>
              <v-spacer></v-spacer>
              <v-flex xs4 right>{{$t('lang.total')}}:</v-flex>
              <v-flex xs3 right>{{topupTotal}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog">      
      <v-card v-if="memberToDelete !== undefined">
        <v-card-title class="headline">{{$t('lang.confirmation.memberEdit')}}</v-card-title>
        <v-card-text>{{$t('lang.confirmation.deleteMember')}} {{this.$store.state.family.members[memberToDelete].MemberName}} ?</v-card-text>
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
export default {
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
    'deleteShow'
  ],
  methods: {
    relationshipChanged(val) {
      if (val) {
        var selectedPlan = this.plans.find(p => p.type == val)

        if (this.item.BasicPlanID != selectedPlan.id)
          this.item.BasicPlanID = null
      }
    },
    ssnChanged(val) {
      if (this.isTopupMember) {
        console.log('updating member...')

        var basicPlan = this.plans.filter(
          p => p.type == this.item.FamilyCode
        )[0].children

        var topups = []
        basicPlan.forEach(function(topup, index) {
          topups.push({
            TopupPlanID: topup.id,
            Amount: null,
            TopupPlanPremiumID: null,
            Selected:
              this.item.SVYDataMemberTopUps[index] &&
              this.item.SVYDataMemberTopUps[index].TopupPlanID == topup.id
          })
        }, this)

        this.item.SVYDataMemberTopUps = topups

        //Calculate age
        var insuranceStartDate = new Date(
          this.$store.state.survey.surveyHeader.SVY_INSURANCESTARTDATEFORCALC
        )
        this.item.Age = this.appUtil.calculateAge(
          this.appUtil.getDateOfBirth(this.item.SSN),
          insuranceStartDate
        )

        this.item.Sex = this.appUtil.GetGender(this.item.SSN)

        this.$store.dispatch('setLoadingStatus', true)
        var vm = this
        api.postData('newapi/getMembers', [this.item]).then(
          res => {
            console.log('res.data :', res.data)
            if (res.data[0] && res.data[0].SVYDataMemberTopUps) {
              vm.item.SVYDataMemberTopUps = res.data[0].SVYDataMemberTopUps
            }
            //this.$store.dispatch('family/updateMembers', res.data)
            this.$store.dispatch('setLoadingStatus', false)
          },
          err => {
            console.log(err)
            this.$store.dispatch('setLoadingStatus', false)
          }
        )
      }
    },
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
    topupTotal() {
      var totalAmount = 0
      var premiumAmounts = []

      if (this.item.SVYDataMemberTopUps) {
        this.item.SVYDataMemberTopUps.forEach(function(topup) {
          if (topup.Selected) premiumAmounts.push(topup.Amount)
        }, this)

        if (premiumAmounts.length > 0) {
          totalAmount = premiumAmounts.reduce(function(acc, val) {
            return acc + val
          })
        }

        this.snackbar = true
      }
      return totalAmount
    }
  }
}
</script>

<style>
.topupSelected {
  color: #80d8ff;
}
</style>
