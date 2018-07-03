/**
 * Import Dependency
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

/**
 * Import Language
 */
import en from './i18n/en-US.json'
import ko from './i18n/ko-KR.json'

/**
 * Config
 */
Vue.use(VueI18n)

/**
 * Export
 */
export default new VueI18n({
  locale: 'en',
  messages: {
    en: {
      lang: en
    },
    ko: {
      lang: ko
    }
  }
})
