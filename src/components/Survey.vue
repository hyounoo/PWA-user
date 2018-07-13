<template>
  <div id="survey">
    <v-progress-linear :indeterminate="$store.state.loading" fixed class="ma-0"></v-progress-linear>
    <!-- <div style="width:100% !important; height: 100% !important; background-color: white; opacity: 0.5; z-index: 1000; position: absolute" class="text-xs-center" v-if="$store.state.loading">
      <v-progress-circular :size="50" color="primary" :indeterminate="$store.state.loading" :style="{ marginTop : getHeight + 'px' }"></v-progress-circular>
    </div> -->
    <v-container v-if="$store.state.survey.surveyHeader && $store.state.survey.surveyContent && $store.state.user.user && $store.state.plan.basicPlan && $store.state.family.members"
      grid-list-xs pb-4>
      <SurveyHeader v-if="setSurveyHeaderVisibility"></SurveyHeader>
      <SurveyContent></SurveyContent>      
    </v-container>
    <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="headline">{{$t('lang.confirmation.surveyStatus')}}</v-card-title>
          <v-card-text>{{confirmationText}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="statusConfirm">{{$t('lang.confirmation.confirm')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import i18n from '../locales/index'
import api from '../utils/backend-api'
import SurveyHeader from './SurveyHeader'
import SurveyContent from './SurveyContent'

export default {
  components: { SurveyHeader, SurveyContent },
  data() {
    return {
      dialog: false,
      confirmationText: ''
    }
  },
  methods: {
    statusConfirm() {
      this.dialog = false
    }
  },
  created() {
    this.$store.dispatch('survey/updateSurveyHeader', null)
    this.$store.dispatch('survey/updateSurveyConent', null)
    this.$store.dispatch('plan/updateBasicPlan', null)
    this.$store.dispatch('family/updateMembers', null)
    this.$store.dispatch('setLoadingStatus', true)

    api.getData('newapi/getSurveyUser').then(
      res => {
        const user = res.data
        Store.dispatch('user/updateUser', user)
        Store.dispatch(
          'switchI18n',
          user.LanguageCodeSet == 'ko-KR' ? 'ko' : 'en'
        )

        this.$store.dispatch(
          'survey/updateSurveySubmittedDate',
          this.$store.state.user.user.SurveySubmittedDate
        )

        api.getData('newapi/getSurveyData').then(
          res => {
            const surveyData = res.data
            console.log('surveyData :', surveyData)

            this.$store.dispatch(
              'survey/updateSurveyHeader',
              surveyData.SurveyHeader
            )

            this.$store.dispatch(
              'survey/updateSurveyConent',
              surveyData.SurveyContent
            )

            this.$store.dispatch('plan/updateBasicPlan', surveyData.BasicPlan)

            this.$store.dispatch('family/updateMembers', surveyData.Members)

            var startDate = Date.parse(
              this.$store.state.survey.surveyHeader.SVY_SURVEYSTARTDATE
            )
            var endDate = Date.parse(
              this.$store.state.survey.surveyHeader.SVY_SURVEYENDDATE
            )

            console.log('not started yet:', startDate >= Date.now())
            console.log('survey ended :', endDate <= Date.now())
            if (
              this.$store.state.survey.surveyHeader.SVY_SURVEYSTATUSCODE !=
              'SST_TEMP_STARTED'
            ) {
              this.dialog = true
              this.confirmationText = i18n.tc('lang.confirmation.surveyEnd')
            }

            if (startDate >= Date.now()) {
              this.dialog = true
              this.confirmationText = i18n.tc(
                'lang.confirmation.surveyNotStarted'
              )
            }

            if (endDate <= Date.now()) {
              this.dialog = true
              this.confirmationText = i18n.tc('lang.confirmation.surveyEnd')
            }

            if (this.$store.state.survey.surveySubmittedDate) {
              this.$store.dispatch(
                'updateSurveyStep',
                this.$store.state.survey.surveySteps.length
              )
            } else {
              this.$store.dispatch('updateSurveyStep', 1)
            }

            this.$store.dispatch('setLoadingStatus', false)
          },
          err => {
            console.log('error :', err)
            this.$store.dispatch('setLoadingStatus', false)
          }
        )
      },
      err => {
        console.log(err)
      }
    )
  },
  mounted() {
    console.log('mounted :', 'survey')
  },
  computed: {
    getHeight() {
      var winHeight = window.innerHeight;
      return winHeight / 2.5;
    },
    setSurveyHeaderVisibility() {
      if(this.$store.state.step == 1 || this.$store.state.step == this.$store.state.survey.surveySteps.length)
        return true;
      else
        return false;
    }
  }
}
</script>

<style scoped>
</style>
