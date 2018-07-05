<template>
  <v-flex xs12>
    <v-layout row wrap>
      <v-flex  :class="{'xs3' : isSummary, 'xs6' : !isSummary}" >{{$t('lang.member.basicPlan')}}</v-flex>
      <v-flex  :class="{'xs9 pt-0' : isSummary, 'xs12' : !isSummary}">
        <v-radio-group v-if="basicPlans"
          v-model="item.BasicPlanID" :class="{'summaryRadio' : isSummary}">
          <template 
            v-for="plan in basicPlans">
            <v-radio :disabled="basicPlanReadOnly" :rules="appUtil.requiredRules($t('lang.member.basicPlan'))"
              :key="plan.id" :label="plan.text" :value="plan.id"  v-if="!isSummary || (isSummary && item.BasicPlanID == plan.id)"></v-radio>
          </template>
        </v-radio-group>
      </v-flex>
    </v-layout>
  </v-flex>
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
    'basicPlanReadOnly',
    'isSummary'
  ],
  methods: {
    validate() {
      return this.$refs.form.validate()
    }
  },
  computed: {
    basicPlans() {
      var plan = this.plans.find(p => p.type == this.item.FamilyCode)
      return plan ? plan.children.filter(p => p.type == 'Basic') : null
    }
  }
}
</script>

<style>
.summaryRadio {
  padding-top:0px
}
</style>
