<template>  
  <v-container fill-height>
    <v-layout row wrap align-center>
      <v-flex xs12 md4 lg3 pa-2>
        <div v-if="surveyContent" v-html="surveyContent.SVY_CON_HEADERDESC"></div>
      </v-flex>
      <v-flex xs12 md4 lg6 pa-2>
        <div v-if="surveyHeader" v-html="surveyHeader.SVY_SURVEYTITLE" class="display-1" style="color:#00a3c3"></div>
      </v-flex>
      <v-flex xs12 md4 lg3 pa-2 text-xs-right>
        <p v-if="surveyUser" style="color:#0058ff">{{ $t('lang.greeting', [surveyUser.UserName]) }}</p>
      </v-flex>
    </v-layout>
  </v-container>  
</template>

<script>
export default {
  name: 'surveyHeader',
  data() {
    return {}
  },
  computed: {
    surveyHeader() {
      return this.$store.state.survey.surveyHeader
    },
    surveyUser() {
      return this.$store.state.user.user
    },
    surveyContent() {
      return this.$store.state.survey.surveyContent
    }
  }
}
</script>

<style>

</style>
