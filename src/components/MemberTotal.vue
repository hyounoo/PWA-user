<template>
    <v-layout row>
        <v-spacer></v-spacer>
        <v-flex xs4 right>{{$t('lang.total')}}:</v-flex>
        <v-flex xs3 right>{{topupTotal}}</v-flex>
    </v-layout>
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
    'index',
    'plans',
    'familyInfoReadyOnly',
    'basicPlanReadOnly',
    'basicPlanShow',
    'topupReadOnly',
    'topupShow',
    'premiumShow',
    'deleteShow'
  ],
  methods: {
  },
  computed: {
    topupTotal() {
      var totalAmount = 0
      var premiumAmounts = []

      if (this.item.SVYDataMemberTopUps) {
        this.item.SVYDataMemberTopUps.forEach(function(topup) {
          if (topup.Selected) premiumAmounts.push(topup.Amount)
        }, this)

        if (premiumAmounts.length > 0) {
          totalAmount = premiumAmounts.reduce(function(acc, val) {
            return acc + val
          })
        }

        this.snackbar = true
      }
      return totalAmount
    }
  }
}
</script>

<style>
</style>
