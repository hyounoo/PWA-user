import axios from 'axios'

let dic = {
  // DEV
  localhost: 'http://localhost/EnrollmentService/',
  '127.0.0.1': 'http://localhost/EnrollmentService/',
  ausy13v0070: 'http://ausy13v0070/EnrollmentServiceNew/',

  // INT
  'dev-int.mcare.co.kr': 'https://dev-int.mcare.co.kr/EnrollmentAdminNew/',
  ausy13v0056: 'http://ausy13v0056/EnrollmentServiceNew/',

  // UAT
  'uat-int.mcare.co.kr': 'https://uat-int.mcare.co.kr/EnrollmentAdminNew/',
  'uat.mcare.co.kr': 'https://uat.mcare.co.kr/EnrollmentServiceNew/',

  // STG
  'stg-int.mcare.co.kr': 'https://stg-int.mcare.co.kr/EnrollmentAdmineNew/',
  'stg.mcare.co.kr': 'https://stg.mcare.co.kr/EnrollmentServiceNew/',


  // PRD
  'int.mcare.co.kr': 'https://int.mcare.co.kr/EnrollmentAdmineNew/',
  'mcare.co.kr': 'https://mcare.co.kr/EnrollmentServiceNew/',


  // TRN
  'trn-int.mcare.co.kr': 'https://trn-int.mcare.co.kr/EnrollmentAdmineNew/',
  'trn.mcare.co.kr': 'https://trn.mcare.co.kr/EnrollmentServiceNew/',


  // SPT
  'spt-int.mcare.co.kr': 'https://spt-int.mcare.co.kr/EnrollmentAdmineNew/',
  'spt.mcare.co.kr': 'https://spt.mcare.co.kr/EnrollmentServiceNew/',
}

let hostname = window.location.hostname
console.log('hostname: ' + hostname)
const BASE_URL = dic[hostname]

console.log('BASE_URL: ' + BASE_URL)

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: false,
  params: {} // do not remove this, its added to add params later in the config
})

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    /* global window Store */
    const {
      token
    } = Store.state.user
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
      config.headers.common['Access-Control-Allow-Origin'] = '*'
    } else {
      // Use application/x-www-form-urlencoded for login
      config.headers.common['Content-Type'] =
        'application/x-www-form-urlencoded'
    }

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => response,
  error => {
    console.log(error.config)
    return Promise.reject(error)
  }
)

export default {
  getData(action) {
    let url = `${BASE_URL}`
    url += action
    return instance.get(url)
  },
  postData(action, data) {
    let url = `${BASE_URL}`
    url += action
    return instance.post(url, data)
  },
  putData(action, data) {
    let url = `${BASE_URL}`
    url += action
    return instance.put(url, data)
  },
  deleteData(action) {
    let url = `${BASE_URL}`
    url += action
    return instance.delete(url)
  },
  login(action, data) {
    let url = `${BASE_URL}`
    url += action
    return instance.post(url, data)
  }
}
