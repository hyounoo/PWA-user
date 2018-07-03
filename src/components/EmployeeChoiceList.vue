<template>
  <div>
    <v-data-iterator v-if="!$store.state.loading"
      content-tag="v-layout" row wrap :items="items"
      
       hide-actions :rows-per-page-items="[-1]">
      <v-flex slot="item" slot-scope="props" xs12 sm6 pa-3>
        <Member :item="props.item" :plans="plans"          
          :familyInfoReadyOnly="true"
          :basicPlanReadOnly="false"
          :basicPlanShow="true"
          :topupShow="false"
        ></Member>
      </v-flex>
    </v-data-iterator>    
  </div>
</template>

<script>
import api from '../utils/backend-api'
import Member from './Member'

export default {
  components: {
    Member
  },
  computed: {
    plans() {
      return this.$store.state.plan.basicPlan.Plans.filter(
        p => p.children && p.children[0].type == 'Basic'
      )
    },
    items() {
      var vm = this
      return this.$store.state.family.members
        ? this.$store.state.family.members.filter(m =>
            vm.plans.find(p => p.type == m.FamilyCode || m.FamilyCode == null)
          )
        : []
    },
    selectedBasicPlan() {
      return this.$store.state.plan.basicPlan.Plans.filter(
        s => s.type == this.selectedMember.FamilyCode
      )[0]
        .children.filter(p => p.type == 'Basic')
        .filter(b => b.id == this.selectedMember.BasicPlanID)[0]
    }
  }
}
</script>
<style>
.datatable .datatable__actions {
  justify-content: flex-start;
  /* padding-left: 10px; */
}
</style>
