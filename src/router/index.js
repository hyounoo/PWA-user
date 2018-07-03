import Vue from 'vue'
import Router from 'vue-router'
import ErrorPage from '@/components/404'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Survey from '@/components/Survey'

import auth from '@/utils/auth'

Vue.use(Router)

function alreadyLogedIn(to, from, next) {
  if (auth.loggedIn()) {
    next({
      path: '/survey'
    })
  } else {
    next()
  }
}

function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}

export default new Router({
  base: '/EnrollmentMobile/',
  mode: 'history',
  routes: [{
      path: '*',
      redirect: '/login'
    },
    {
      path: '/404',
      component: ErrorPage,
      name: 'ErrorPage'
    },

    {
      path: '/',
      redirect: '/survey'
    },
    {
      path: '/login',
      component: Login,
      name: 'Login',
      beforeEnter: alreadyLogedIn
    },
    {
      path: '/logout',
      beforeEnter(to, from, next) {
        auth.logout()
        next('/login')
      }
    },
    {
      path: '/backtoapp',
      beforeEnter(to, from, next) {
        auth.logout()
        next('/login')
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/survey',
      name: 'Survey',
      component: Survey,
      beforeEnter: requireAuth
    }
  ]
})
