<template>
  <v-layout row wrap align-center>
    <v-flex xs12 pa-2 v-if="surveyContent">
      {{surveyContent.SVY_CON_FAMILYINFOPAGETITLE}}
    </v-flex>
    <v-flex xs12 pa-2 v-if="surveyContent" class="overflow">
      <div v-html="surveyContent.SVY_CON_FAMILYINFOPAGEDESC"></div>      
    </v-flex>
    <v-flex xs12 py-2 px-1 mb-5 v-if="$store.state.plan.basicPlan.Plans">
      <Family-list ref="familyList"></Family-list>
    </v-flex>
  </v-layout>
</template>

<script>
import FamilyList from './FamilyList'

export default {
  name: 'familyInput',
  components: { FamilyList },
  created() {},
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
      this.$refs.familyList.$refs.Members.$children.forEach(member => {
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
