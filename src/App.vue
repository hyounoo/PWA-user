<template>
  <v-app>
    <v-navigation-drawer temporary v-model="drawer" fixed app >
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
              <v-list-tile-title class="text-xs-center">Navigation</v-list-tile-title>            
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="item in items" :key="item.url" :to="item.url" v-if="item.visible">          
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>            
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app :fixed="fixed">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link :to="'/home'">
        <!-- <img :src="require('@/assets/android-icon-36x36.png')" alt="Marsh"> -->
      </router-link>
      <v-toolbar-title>{{surveyHeader}}</v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <!-- <BottomSheet></BottomSheet> -->
      <v-btn icon :to="'/backtoapp'">
        <v-icon>clear</v-icon>
      </v-btn>
      
      <!-- <v-badge class="ml-5">
        <span slot="badge">6</span>
        <v-icon large color="grey lighten-1">account_box</v-icon>
      </v-badge>

      <v-badge color="red" class="ml-5">
        <span slot="badge">!</span>
        <v-icon large color="grey">mail</v-icon>
      </v-badge> -->
    </v-toolbar>    
    <v-content>
      <router-view/>
    </v-content>
    <v-snackbar v-if="$store.state.error" :top="true" v-model="$store.state.error">              
      <span v-t="$store.state.errorText"></span>              
      <v-btn class="pink--text errText" flat @click.native="$store.state.error = false">Close</v-btn>
    </v-snackbar>
    <v-btn class="scrollButton" fab dark fixed bottom right small color="red" v-scroll="onScroll" v-show="fab" @click="toTop">
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import auth from '@/utils/auth'
import api from '@/utils/backend-api'
import BottomSheet from './components/BottomSheet'

export default {
  name: 'App',
  components: {
    BottomSheet
  },
  data() {
    return {
      fab: false,
      drawer: false,
      fixed: true,
      title: 'Enrollment User'
    }
  },
  methods: {
    onScroll() {
      if (typeof window === 'undefined') return

      const top = window.pageYOffset || document.documentElement.offsetTop || 0

      this.fab = top > 300
    },
    toTop() {
      this.$vuetify.goTo(0)
    }
  },
  computed: {
    items() {
      return [
        // {
        //   icon: 'home',
        //   title: 'Home',
        //   url: '/home',
        //   visible: true
        // },
        {
          icon: 'lock_open',
          title: 'Login',
          url: '/login',
          visible: !auth.loggedIn()
        },
        {
          icon: 'description',
          title: 'Survey',
          url: '/survey',
          visible: auth.loggedIn()
        },
        // {
        //   icon: 'lock',
        //   title: 'Logout',
        //   url: '/logout',
        //   visible: auth.loggedIn()
        // },
        {
          icon: 'arrow_back',
          title: 'Close',
          url: '/backtoapp',
          visible: auth.loggedIn()
        }
      ]
    },
    surveyHeader() {
      if(this.$store.state.survey.surveyHeader !== null)
        this.title = this.$store.state.survey.surveyHeader.SVY_SURVEYTITLE
      return this.title
    }
  },
  created() {
    let token = this.$route.query.token
    console.log('token :', token)
    if (token) {
      Store.dispatch('user/updateToken', token)
      api.getData('newapi/getSurveyUser').then(
        res => {
          const user = res.data
          Store.dispatch('user/updateUser', user)
          Store.dispatch(
            'switchI18n',
            user.LanguageCodeSet == 'ko-KR' ? 'ko' : 'en'
          )
          this.$router.push('survey')
        },
        err => {
          console.log(err)
        }
      )
    }
    this.$store.state.loading = false
  }
}
</script>
<style scoped>
.errText {
  font-family: 'Malgun Gothic';
}
.application.theme--light {
  background: white;
}

.scrollButton {
  right: 25px;
  bottom: 45px;
}
</style>