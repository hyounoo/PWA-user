<template>
  <v-flex xs12>
    <v-layout row wrap>
      <v-flex  :class="{'xs3' : basicPlanReadOnly, 'xs6' : !basicPlanReadOnly}" v-if="basicPlanReadOnly">{{$t('lang.member.basicPlan')}}</v-flex>
      <v-flex  :class="{'xs9 pt-0' : basicPlanReadOnly, 'xs12' : !basicPlanReadOnly}">
        <v-radio-group v-if="basicPlans"
          v-model="item.BasicPlanID" :class="{'pt-0' : basicPlanReadOnly}">
          <template 
            v-for="plan in basicPlans">
            <v-radio :disabled="basicPlanReadOnly" :rules="appUtil.requiredRules($t('lang.member.basicPlan'))"
              :key="plan.id" :label="plan.text" :value="plan.id"  v-if="!basicPlanReadOnly || (basicPlanReadOnly && item.BasicPlanID == plan.id)"></v-radio>
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
</style>
