<template>
  <div>
    <v-container v-if="!$store.state.loading" fluid grid-list-md>
      <v-data-iterator content-tag="v-layout" row wrap :items="allItems"
        hide-actions :rows-per-page-items="[-1]">
        <v-flex slot="item" slot-scope="props" xs12 sm6 pa-3>
          <summary-member :item="props.item" :plans="plans" class="elevation-9"
            :familyInfoReadyOnly="true" 
            :basicPlanReadOnly="true" :basicPlanShow="!$store.state.survey.surveyHeader.SVY_SUMMARYDISPLAY_PLANBASIC" 
            :topupReadOnly="true" :topupShow="!$store.state.survey.surveyHeader.SVY_SUMMARYDISPLAY_PLANTOPUP"
            :premiumShow="!$store.state.survey.surveyHeader.SVY_SUMMARYDISPLAY_PREMIUM"
            :isSummary="true"
            ref="members"></summary-member>
        </v-flex>
      </v-data-iterator>
    </v-container>
    <v-card v-if="!$store.state.loading" class="elevation-9 ma-3">
      <v-card-text>        
        <v-flex>
          <v-layout row>
            <v-spacer xs5 md8></v-spacer>
            <v-flex xs4 md2 right>{{$t('lang.totalPremium')}}:</v-flex>
            <v-flex xs3 md2 right text-xs-right><span class="totalPremium">{{ totalPremium }}</span></v-flex>
          </v-layout>
        </v-flex>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from '../utils/backend-api'
import SummaryMember from './SummaryMember'
export default {
  components: {
    SummaryMember
  },
  data() {
    return {
      disableInitialSort: true,
      headers: [
        { text: 'Family Code', value: 'FamilyCode', align: 'center' },
        { text: 'Member Name', value: 'MemberName', align: 'center' },
        { text: 'SSN', value: 'SSN', align: 'center' },
        { text: 'Visibility', align: 'center' },
        { text: 'Edit', align: 'center' }
      ],
      selectedMember: null,
      selectedIndex: null,
      selectedTopups: [],
      dialog: false,
      ssn: true,
      response: 'Calculating premiums...',
      y: 'bottom',
      x: null,
      mode: '',
      timeout: 4000
    }
  },
  computed: {
    plans() {
      return this.$store.state.plan.basicPlan.Plans
    },
    items() {
      return this.$store.state.family.members.filter(b => b.BasicPlanID != null)
    },
    topupItems() {
      return this.$store.state.family.members.filter(b => b.BasicPlanID == null)
    },
    allItems() {
      var allitem = this.items.concat(this.topupItems);
      return allitem
    },
    selectedBasicPlan() {
      return this.$store.state.plan.basicPlan.Plans.filter(
        s => s.type == this.selectedMember.FamilyCode
      )[0]
        .children.filter(p => p.type == 'Basic')
        .filter(b => b.id == this.selectedMember.BasicPlanID)[0]
    },
    totalPremium() {
      var premiumAmounts = []
      if (this.items) {
        this.items.forEach(function(member) {
          if (member.SVYDataMemberTopUps) {
            member.SVYDataMemberTopUps.forEach(function(topup) {
              if (topup.Selected) premiumAmounts.push(topup.Amount)
            }, this)
          }
        }, this)
      }

      if (this.topupItems) {
        this.topupItems.forEach(function(member) {
          if (member.SVYDataMemberTopUps) {
            member.SVYDataMemberTopUps.forEach(function(topup) {
              if (topup.Selected) premiumAmounts.push(topup.Amount)
            }, this)
          }
        }, this)
      }

      var totalAmount = 0
      if (premiumAmounts.length > 0) {
        totalAmount = premiumAmounts.reduce(function(acc, val) {
          return acc + val
        })
      }

      this.snackbar = true
      return totalAmount.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    }
  },
  methods: {
    editItem(index) {
      this.selectedTopups = []
      this.selectedIndex = index
      var target = this.items[index]

      this.selectedMember = {
        BasicPlanID: target.BasicPlanID,
        FamilyCode: target.FamilyCode,
        IsForeigner: target.IsForeigner,
        MemberName: target.MemberName,
        SSN: target.SSN,
        SVYDataMemberID: target.SVYDataMemberID,
        SVYDataMemberTopUps: target.SVYDataMemberTopUps
      }

      target.SVYDataMemberTopUps.forEach(function(topup) {
        console.log('inserting: ' + topup)
        this.selectedTopups.push({
          Selected: topup.Selected,
          TopupPlanID: topup.TopupPlanID,
          Amount: topup.Amount,
          TopupPlanPremiumID: topup.TopupPlanPremiumID
        })
      }, this)
      this.dialog = true
    }
  }
}
</script>
<style scoped>
.totalPremium {
  color: #80d8ff;
}
</style>
