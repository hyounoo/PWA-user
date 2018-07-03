<template>
  <div>
    <v-container v-if="!$store.state.loading" fluid grid-list-md>
      <v-card v-if="!$store.state.loading" class="elevation-9 ma-2">
        <v-card-text>        
          <v-flex>
            <v-layout row>            
              <v-flex xs12>{{$t('lang.topup.basicPlan')}}</v-flex>
            </v-layout>
          </v-flex>
        </v-card-text>
      </v-card>
      <v-data-iterator content-tag="v-layout" row wrap :items="items" 
        hide-actions :rows-per-page-items="[-1]">
        <v-flex slot="item" slot-scope="props" xs12 sm6 pa-3 v-if="visible(props.item)">
          <Member :item="props.item" :index="props.index" :plans="plans" v-if="plans"
            :familyInfoReadyOnly="true"
            :basicPlanReadOnly="true"
            :basicPlanShow="true"
            :topupShow="true"
          ></Member>
        </v-flex>
      </v-data-iterator>
      <v-card v-if="!$store.state.loading" class="elevation-9 ma-2">
        <v-card-text>        
          <v-flex>
            <v-layout row>            
              <v-flex xs12>{{$t('lang.topup.topupPlan')}}</v-flex>
            </v-layout>
          </v-flex>
        </v-card-text>
      </v-card>
      <v-data-iterator content-tag="v-layout" row wrap :items="items"
        hide-actions :rows-per-page-items="[-1]">
        <v-flex slot="item" slot-scope="props" xs12 sm6 pa-3 v-if="!visible(props.item)">
          <Member :item="props.item" :index="props.index" :plans="plans" v-if="plans"
            :familyInfoReadyOnly="true"
            :basicPlanReadOnly="true"
            :basicPlanShow="true"
            :topupShow="true"
          ></Member>
        </v-flex>
      </v-data-iterator>
    </v-container>    
    <v-snackbar v-if="!$store.state.loading"
      :timeout="timeout"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbar">
      <span large> Total Premium Amount: <span class="totalPremium">{{ totalPremium }}</span></span>
      <v-btn flat color="red" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-card v-if="!$store.state.loading" class="elevation-9 ma-3">
      <v-card-text>        
        <v-flex>
          <v-layout row>
            <v-spacer xs5 md8></v-spacer>
            <v-flex xs4 md2 right>{{$t('lang.totalPremium')}}:</v-flex>
            <v-flex xs3 md2 right><span class="totalPremium">{{ totalPremium }}</span></v-flex>
          </v-layout>
        </v-flex>
      </v-card-text>
    </v-card>   
  </div>
</template>

<script>
import api from '../utils/backend-api'
import Member from './Member'
export default {
  components: {
    Member
  },
  data() {
    return {
      snackbar: false,
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
      return this.$store.state.family.members
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
      return totalAmount
    }
  },
  methods: {
    visible(item) {
      var plan = this.plans.find(p => p.type == item.FamilyCode)

      var result = plan
        ? plan.children.filter(p => p.type == 'Basic').length > 0
        : null
      return result
    }
  }
}
</script>
<style scoped>
.topupSelected {
  color: #80d8ff;
}

.totalPremium {
  color: #80d8ff;
}
</style>
