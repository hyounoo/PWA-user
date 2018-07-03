// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './stylus/main.styl'
import 'babel-polyfill'
import 'vuetify/dist/vuetify.min.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import store from '@/store'
import api from './utils/backend-api'
import appUtil from './utils/app-util'
import i18n from './locales'


Vue.use(Vuetify, {
  theme: {
    primary: '#1565C0',
    secondary: '#FFFFFF',
    accent: '#80D8FF',
    error: '#FFAB91',
    warning: '#BF360C',
    info: '#2196f3',
    success: '#4caf50'
  }
})

Vue.config.productionTip = false

window.Store = store
Vue.prototype.api = api
Vue.prototype.appUtil = appUtil

Vue.filter('formatDate', function (value) {
  if (value) return moment(String(value)).format('YYYY-MM-DD')
})

const lang = store.state.language
if (lang) {
  i18n.locale = lang
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {
    App
  },
  template: '<App/>'
})
