<template>
  <v-layout row wrap align-center>
    <v-flex xs12 pa-2 v-if="surveyContent">
      {{surveyContent.SVY_CON_SUMMARYPAGETITLE}}
    </v-flex>
    <v-flex xs12 pa-2 v-if="surveyContent" class="overfolow">
      <div v-html="surveyContent.SVY_CON_SUMMARYPAGEDESC"></div>      
    </v-flex>
    <v-flex xs12 py-2 px-0 v-if="$store.state.plan.basicPlan.Plans">
      <SurveySummaryList ref="summaryList"></SurveySummaryList>
    </v-flex>
    
  </v-layout>
</template>

<script>
import SurveySummaryList from './SurveySummaryList'
export default {
  name: 'surveySummary',
  components: { SurveySummaryList },
  data() {
    return {
      dialog:
        this.$store.state.survey.surveyHeader.SVY_SURVEYSTATUSCODE !=
        'SST_TEMP_STARTED'
    }
  },
  computed: {
    surveyContent() {
      return this.$store.state.survey.surveyContent
    }
  },
  methods: {
    validate() {
      this.$refs.summaryList.$children[0].$children.forEach(member => {
        member.reset()
      })
    },
    statusConfirm() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.overflow {
  overflow-x: auto;
}
</style>
