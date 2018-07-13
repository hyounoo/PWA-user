<template>
  <v-text-field :placeholder="$t('lang.member.name')" 
    :rules="appUtil.requiredRules($t('lang.member.name'))"
    :readonly="familyInfoReadyOnly && !isTopupMember" :return-value.sync="item.MemberName" v-model="item.MemberName" v-if="!familyInfoReadyOnly || isTopupMember" type="text"></v-text-field>
    <span v-else class="memberName subheading">
      {{  item.MemberName }}
      </span>
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
    'familyInfoReadyOnly'
  ],
  methods: {
  },
  computed: {
    isTopupMember() {
      let name = this.$store.state.survey.surveySteps[
        this.$store.state.step - 1
      ].name
      return name == 'lang.topup.step' && this.item.BasicPlanID == null
    }
  }
}
</script>

<style>
.memberName{
    color: #075895;
    font-weight: bold;
}
</style>
