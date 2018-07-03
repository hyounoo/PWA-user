<template>
  <div class="pa-3">
    <v-bottom-sheet v-model="sheet">
      <v-btn icon slot="activator">
        <v-icon color="primary">dashboard</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline">Options</v-card-title>
        <v-layout row>
          <v-flex xs6>
            <v-card-text>
              Show Survey Header
            </v-card-text>
          </v-flex>
          <v-flex xs6>
            <v-card-actions>
              <v-switch v-model="$store.state.showHeader"></v-switch>
            </v-card-actions>            
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <v-card-text>
              Language
            </v-card-text>
          </v-flex>
          <v-flex xs6>
            <v-card-actions>
              <v-radio-group v-model="locale" row>
              <v-radio label="Korean" value="ko" >한국어</v-radio>
              <v-radio label="English" value="en">English</v-radio>
            </v-radio-group>
            </v-card-actions>            
          </v-flex>
        </v-layout>
      </v-card>      
    </v-bottom-sheet>
  </div>
</template>
<script>
// import i18n from '../locales'
export default {
  data() {
    return {
      sheet: false
    }
  },
  computed: {
    locale: {
      get() {
        return this.$i18n.locale
      },
      set(value) {
        this.$store.dispatch('switchI18n', value)
      }
    }
  }
}
</script>
<style scoped>
</style>