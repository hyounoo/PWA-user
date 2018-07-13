<template>
  <div>
    <span v-if="isSummary">{{ getSSN }}</span>
    <v-layout row v-else>
      <!-- <v-flex xs5>
        <v-text-field :placeholder="$t('lang.member.ssn')" @change="ssnChanged"
          :rules="appUtil.ssnRules(item.SSN)"
          :readonly="familyInfoReadyOnly && !isTopupMember" mask="######" 
          v-model="firstSSN" :value="getFirstSSN"
          @keyup="autoFocus">
        </v-text-field>
      </v-flex>
      <v-flex xs1>
        <span>
          -
        </span>
      </v-flex>
      <v-flex xs6>
        <v-text-field :placeholder="$t('lang.member.ssn')" @change="ssnChanged"
          :rules="appUtil.ssnRules(item.SSN)"
          :readonly="familyInfoReadyOnly && !isTopupMember" mask="#######" 
          v-model="secondSSN" ref="nextSSN" :value="getSecondSSN">
        </v-text-field>
      </v-flex> -->
      <v-text-field :placeholder="$t('lang.member.ssn')" @change="ssnChanged"
    :rules="appUtil.ssnRules(item.SSN)"
        :readonly="familyInfoReadyOnly && !isTopupMember" mask="######-#######" 
        v-model="item.SSN" @keyup="checkDigits" ref="ssn" type="tel">
    </v-text-field>
    </v-layout>
  </div>
</template>

<script>
import i18n from '../locales/index'
import api from '../utils/backend-api'
export default {
  data() {
    return {
      // firstSSN: '',
      // secondSSN: ''
    }
  },
  props: [
    'item',
    'index',
    'plans',
    'familyInfoReadyOnly',
    'isSummary'
  ],
  methods: {
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
    checkDigits() {
      
      if(this.item.SSN.length == 6)
        this.$refs.ssn.$el.getElementsByTagName('input')[0].setSelectionRange(7,7);
    }
  },
  computed: {
    isTopupMember() {
      let name = this.$store.state.survey.surveySteps[
        this.$store.state.step - 1
      ].name
      return name == 'lang.topup.step' && this.item.BasicPlanID == null
    },
    getSSN() {
      return this.item.SSN
    },
    // getFirstSSN() {
    //   if(this.item.SSN != "") {
    //     this.firstSSN = this.item.SSN.slice(0,6)
    //     return this.item.SSN.slice(0,6)
    //   }
    //     else
    //     return "";
    // },
    // getSecondSSN() {
    //   if(this.item.SSN != "") {
    //     this.secondSSN = this.item.SSN.slice(7)
    //     return this.item.SSN.slice(7)
    //   }
    //     else
    //     return "";
    // }
  }
}
</script>

<style>
</style>
