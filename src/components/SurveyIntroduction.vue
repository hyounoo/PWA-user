<template>
  <v-layout row wrap align-center>
    <v-flex xs12 pa-2 v-if="surveyContent">
      <div v-html="surveyContent.SVY_CON_LOGINPAGEDESC"></div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'surveyIntroduction',
  data() {
    return {}
  },
  computed: {
    errText() {
      if (this.$store.state.plan.basicPlan.Plans.length == 0) return 'plan'
      if (this.$store.state.user.user.ProgramId == null) return 'programid'
    },
    surveyContent() {
      return this.$store.state.survey.surveyContent
    }
  },
  methods: {}
}
</script>

<style>
</style>
