<template>
  <div>
    <v-text-field :label="$t('lang.member.ssn')" v-if="isSummary"
        readonly mask="######-#######" 
        v-model="item.SSN"         
        :type="item.SSNVisibility ? 'password' : 'text'">
    </v-text-field>
    <v-text-field :label="$t('lang.member.ssn')" @change="ssnChanged" v-if="!isSummary"
    :rules="appUtil.ssnRules(item.SSN)"
        :readonly="familyInfoReadyOnly && !isTopupMember" mask="######-#######" 
        v-model="item.SSN" 
        :append-icon-cb="() => (item.SSNVisibility = !item.SSNVisibility)"
        :append-icon="item.SSNVisibility ? 'visibility' : 'visibility_off'"
        :type="item.SSNVisibility ? 'password' : 'text'">
    </v-text-field>
  </div>
</template>

<script>
import i18n from '../locales/index'
import api from '../utils/backend-api'
export default {
  data() {
    return {
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
    }
  }
}
</script>

<style>
</style>
