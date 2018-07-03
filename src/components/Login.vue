<template>
<v-container fill-height justify-center align-center >
  <!-- <v-layout row > -->
    <v-flex xs12 sm6>      
      <!-- <h1> &nbsp;</h1> -->
      <v-card class="mt-0 pt-0">
        <v-card-title class="blue darken-1">
          <h4 style="color:white">{{$t('lang.login.enrollmentUser')}}</h4>
        </v-card-title>
        <v-progress-linear :indeterminate="$store.state.loading" class="ma-0"></v-progress-linear>
        <v-card-text>            
          <v-form v-model="valid" @submit.prevent="login">
            <v-layout row>
              <v-flex xs4>
                <v-subheader>{{$t('lang.login.userId')}}</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field :readonly="$store.state.loading" class="input-group--focused" name="userId" clearable
                  v-model="computedUserId" :rules="appUtil.requiredRules($t('lang.login.userId'))" :label="$t('lang.login.userId')"
                  ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>{{$t('lang.login.password')}}</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field :readonly="$store.state.loading" class="input-group--focused" name="password" type="password" clearable
                v-model="pass" :label="$t('lang.login.password')" :rules="appUtil.requiredRules($t('lang.login.password'))"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>
                <v-btn :disabled="$store.state.loading ||!valid" type="submit">{{$t('lang.login.login')}}</v-btn>
              </v-flex>              
            </v-layout>
            <v-snackbar v-if="error" :top="true" v-model="error">              
              <span v-t="text"></span>              
              <v-btn class="pink--text" flat @click.native="error = false">Close</v-btn>
            </v-snackbar>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  <!-- </v-layout> -->
  </v-container>
</template>
<script>
import auth from '../utils/auth'
import appUtil from '../utils/app-util.js'
export default {
  data() {
    return {
      valid: true,
      userId: '', //'BR_Kim@amat.com', //'mine0427@nii.co.kr',
      pass: '', //'welcome1',
      error: false,
      text: ''
    }
  },
  computed: {
    computedUserId: {
      get() {
        return this.userId
      },
      set(value) {
        if (value) this.userId = value.toLowerCase()
      }
    }
  },
  methods: {
    login() {
      this.$store.dispatch('setLoadingStatus', true)
      auth.login(this.userId, this.pass, (loggedIn, err) => {
        this.$store.dispatch('setLoadingStatus', false)
        if (err) {
          if (err.response) {
            console.log('err response data', err.response.data)
            this.text = 'lang.error.' + err.response.data.error
            this.error = true
          } else {
            console.log('err message', err.message)
            this.text = 'lang.error.network_error'
            this.error = true
          }
        } else if (loggedIn === false) {
          console.log('loggedIn', loggedIn)
          this.error = true
          this.text = 'Bad login information'
        } else {
          console.log(this.$route)
          this.$router.push(this.$route.query.redirect || '/')
        }
      })
    }
  }
}
</script>
<style>
</style>
