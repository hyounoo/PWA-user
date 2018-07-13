<template>
  <div>
    <v-data-iterator v-if="!$store.state.loading"
      content-tag="v-layout" row wrap :items="items"       
      hide-actions :rows-per-page-items="[-1]"
      ref="Members">
      <v-flex slot="item" slot-scope="props" xs12 sm6 pa-3 v-if="visible(props.item)">
        <Member :item="props.item" :index="props.index" :key="props.index" :plans="plans"          
          :basicPlanShow="false"
          :topupShow="false"
          :deleteShow="true"
        ></Member>
      </v-flex>
    </v-data-iterator>
    <add-member></add-member>
  </div>
</template>

<script>
import api from '../utils/backend-api'
import Member from './Member'
import AddMember from './AddMember'

export default {
  components: {
    Member,
    AddMember
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    plans() {
      return this.$store.state.plan.basicPlan.Plans.filter(
        p => p.children && p.children[0].type == 'Basic'
      )
    },
    items() {
      return this.$store.state.family.members
    }
  },
  methods: {
    visible(item) {
      var plan = this.plans.find(p => p.type == item.FamilyCode)

      var result = plan
        ? plan.children.filter(p => p.type == 'Basic').length > 0
        : item.FamilyCode == null ? true : false
      return result
    }
    // deleteItem(index) {
    //   // alert user for delete
    //   if (this.items[index].FamilyCode == 'FMM_EMPLOYEE') {
    //     Store.state.error = true
    //     Store.state.errorText = i18n.tc('lang.validation.cannotRemoveEmployee')
    //   } else {
    //     this.dialog = true
    //     // var r = confirm(
    //     //   'Do you want to delete ' + this.items[index].MemberName + '?'
    //     // )
    //     // if (r == true) {
    //     //   this.$store.dispatch('family/removeMember', index)
    //     // }
    //   }
    // }
  },
  created() {}
}
</script>
<style>
.datatable .datatable__actions {
  justify-content: flex-start;
  /* padding-left: 10px; */
}
</style>
