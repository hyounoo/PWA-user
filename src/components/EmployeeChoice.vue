<template>
  <v-layout row wrap align-center>
    <v-flex xs12 pa-2 v-if="surveyContent">
      {{surveyContent.SVY_CON_PLANBASICPAGETITLE}}
    </v-flex>
    <v-flex xs12 pa-2 v-if="surveyContent" class="overflow">
      <div v-html="surveyContent.SVY_CON_PLANBASICPAGEDESC"></div>      
    </v-flex>
    <v-flex xs12 py-2 px-1 v-if="$store.state.plan.basicPlan.Plans">
      <Employee-choice-list ref="basicPlanList"></Employee-choice-list>
    </v-flex>
  </v-layout>
</template>

<script>
import EmployeeChoiceList from './EmployeeChoiceList'
import MemberVue from './Member.vue'
export default {
  name: 'employeeChoice',
  components: { EmployeeChoiceList },
  data() {
    return {}
  },
  computed: {
    surveyContent() {
      return this.$store.state.survey.surveyContent
    }
  },
  methods: {
    validate() {
      this.$refs.basicPlanList.$children[0].$children.forEach(member => {
        member.validate()
      })
    }
  }
}
</script>

<style scoped>
.overflow {
  overflow-x: auto;
}
</style>
