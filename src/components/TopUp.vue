<template>
  <v-layout row wrap align-center>
    <v-flex xs12 pa-2 v-if="surveyContent">
      {{surveyContent.SVY_CON_PLANTOPUPPAGETITLE}}
    </v-flex>
    <v-flex xs12 pa-2 v-if="surveyContent" class="overflow">
      <div v-html="surveyContent.SVY_CON_PLANTOPUPPAGEDESC"></div>      
    </v-flex>
    <v-flex xs12 py-2 px-0 v-if="$store.state.plan.basicPlan.Plans">
      <Top-up-list ref="TopUpList"></Top-up-list>
    </v-flex>
  </v-layout>
</template>

<script>
import TopUpList from './TopUpList'
export default {
  name: 'topup',
  components: { TopUpList },
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
      var valid = true
      this.$refs.TopUpList.$children[1].$children.forEach(member => {
        valid = member.validate()
      })

      this.$refs.TopUpList.$children[3].$children.forEach(member => {
        valid = member.validate()
      })
      return valid
    }
  }
}
</script>

<style scoped>
.overflow {
  overflow-x: auto;
}
</style>
