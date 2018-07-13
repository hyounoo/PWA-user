<template>
  <div>
    <!-- <v-text-field v-if="isSummary || (familyInfoReadyOnly && !isTopupMember)" :label="$t('lang.member.relationship')" v-model="familyCodeToString" readonly></v-text-field> -->
    <span v-if="isSummary || (familyInfoReadyOnly && !isTopupMember)">{{ familyCodeToString }}</span>
    <v-select :placeholder="$t('lang.member.relationship')"  v-else
      :rules="appUtil.memberRules(item)"
      :readonly="familyInfoReadyOnly && !isTopupMember" @change="relationshipChanged" 
      :items="isTopupMember ? topupPlans : plans" v-model="item.FamilyCode" item-text="text" item-value="type">
    </v-select>
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
    'plans',
    'familyInfoReadyOnly',
    'isSummary'
  ],
  methods: {
    relationshipChanged(val) {
      if (val) {
        var selectedPlan = this.plans.find(p => p.type == val)

        if (this.item.BasicPlanID != selectedPlan.id)
          this.item.BasicPlanID = null
      }
    }
  },
  computed: {
    familyCodeToString(){
      
      if(this.isSummary || (this.familyInfoReadyOnly && !this.isTopupMember))
      {
        var str = this.plans.find(m => m.type == this.item.FamilyCode)
        return str === undefined ? null : str.text
      }
    },
    isTopupMember() {
      let name = this.$store.state.survey.surveySteps[
        this.$store.state.step - 1
      ].name
      return name == 'lang.topup.step' && this.item.BasicPlanID == null
    },
    topupPlans() {
      return this.$store.state.plan.basicPlan.Plans.filter(
        p => p.children && p.children[0].type != 'Basic'
      )
    }
  }
}
</script>

<style>
</style>
