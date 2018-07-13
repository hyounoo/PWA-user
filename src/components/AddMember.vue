<template>
  <div class="pa-3">
    <v-btn block color="info" class="ma-0" @click="addItem()" ref="addBtn">
      <v-icon dark>
        add
      </v-icon>
      {{$t(btnText)}}
    </v-btn>
  </div>
</template>

<script>
import api from '../utils/backend-api'
import i18n from '../locales/index'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    btnText() {
      if(this.$store.state.survey.surveySteps[this.$store.state.step - 1].name == 'lang.familyInfo.step')
        return 'lang.familyInfo.addButton'
      else
        return 'lang.topup.addButton'
    }
  },
  methods: {
    addItem() {
      var member = {
        BasicPlanID: null,
        FamilyCode: null,
        IsForeigner: false,
        MemberName: '',
        SSN: '',
        SVYDataMemberID: null,
        SVYDataMemberTopUps: []
      }
      this.$store.dispatch('family/addMember', member)
      
      this.$vuetify.goTo(this.$refs.addBtn, { "duration": 300, "offset": 500, "easing": "easeInOutCubic" })
    }
  },
  created() {}
}
</script>
<style>
</style>
