/* globals Store */
import api from './backend-api'

export default {
  login(userId, pass, cb) {
    cb = arguments[arguments.length - 1]
    let data =
      'username=' + userId + '&password=' + pass + '&grant_type=password'

    api.login('usertoken', data).then(
      res => {
        const token = res.access_token || res.data.access_token
        Store.dispatch('user/updateToken', token)
        if (cb) cb(true, null)
        // api.getData('newapi/getSurveyUser').then(
        //   res => {
        //     const user = res.data
        //     Store.dispatch('user/updateUser', user)
        //     Store.dispatch(
        //       'switchI18n',
        //       user.LanguageCodeSet == 'ko-KR' ? 'ko' : 'en'
        //     )
        //   },
        //   err => {
        //     console.log(err)
        //   }
        // )
        this.onChange(true)
      },
      err => {
        console.log(err)
        if (cb) cb(false, err)
        this.onChange(false)
      }
    )
  },
  getToken() {
    return Store.state.user.token
  },
  logout(cb) {
    Store.dispatch('user/logout')
    location.replace("marshmcare://CallCloseInapp");
    if (cb) cb(false)
    this.onChange(false)
  },
  loggedIn() {
    return !!Store.state.user.token
  },
  onChange(success) {
    Store.dispatch('setLoadingStatus', false)
    console.log('auth change: ' + success)
  }
}
