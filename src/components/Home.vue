<template>
    <v-content>
      <section>
        <!-- <v-parallax :src="require('@/assets/hero.jpeg')" height="600">
          <v-layout column align-center justify-center class="white--text" >
            <img :src="require('@/assets/android-icon-192x192.png')" alt="Marsh" height="200">
            <h1 class="white--text mb-2 display-1 text-xs-center">Enrollment Service</h1>
            <div class="subheading mb-3 text-xs-center">Powered by Vuetify</div>
            <v-btn class="blue lighten-2 mt-5" dark large href="/Survey" >Get Started</v-btn>
          </v-layout>
        </v-parallax> -->
      </section>

      <section>
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">The best way to start developing</h2>
              <span class="subheading">
                Marsh GIT team
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">color_lens</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Material Design</div>
                    </v-card-title>
                    <v-card-text>
                      Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Continuos Integration</div>
                    </v-card-title>
                    <v-card-text>
                      Enrollment Service has a consistent update cycle. The development team is committed to providing you with the best experience you can have.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">build</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Amazing support</div>
                    </v-card-title>
                    <v-card-text>
                      When you run into a roadblock, you need assistance immediately. GIT team offers support via JIRA.
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <!-- <v-parallax :src="require('@/assets/section.jpg')" height="380">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-3 text-xs-center">Web development delivery has never been this fast</div>
            <em>Contact GIT with your requirement today</em>
            <v-btn
              class="blue lighten-2 mt-5"
              dark
              large
              href="/contact"
            >
              Contact
            </v-btn>
          </v-layout>
        </v-parallax> -->
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-5">
            <v-flex xs12 sm4>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Company info</div>
                </v-card-title>
                <v-card-text>
                  Marsh Korea, Inc. operates as a risk management and insurance consulting company in Korea.
                  It provides services in the areas of private and commercial insurance, including risk identification, analysis, and control/improvement; 
                  and cost-effective insurance program design and implementation, insurance due diligence, insurance program administration, claims assistance and management, loss prevention, international reinsurance arrangement, staff training, loan protection and lender's requirement services, etc. 
                  The company was founded in 1979 and is based in Seoul, South Korea. Marsh Korea, Inc. is a subsidiary of Marsh Inc.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Contact us</div>
                </v-card-title>
                <v-card-text>
                  Marsh Korea
                </v-card-text>
                <v-list class="transparent">
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">phone</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>123-456-7890</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">place</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Seoul, Korea</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">email</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>contact@marsh.com</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>
      
    </v-content>
</template>

<script>
export default {
  name: 'home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
