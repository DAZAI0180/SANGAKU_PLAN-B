<template>
  <v-app>
    
    <v-content>
        <nuxt />
    </v-content>

 <!-- <v-card height="60px" flat> -->
   <v-footer>
 <v-bottom-nav :value="true" :active.sync="bottomNav"
 :fixed=true >
  <v-btn color="teal" flat value="recent" to = "/" >
    <span>ホーム</span>
    <v-icon>home</v-icon>
  </v-btn>

      <v-btn
        color="teal"
        flat
        value="favorites"
        to="/item_create"
      >
        <span>出品</span>
        <v-icon>photo_camera</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="unko"
        to = "/mypage/"
      >
        <span>マイページ</span>
        <v-icon>accessibility</v-icon>
      </v-btn>
    </v-bottom-nav>
    </v-footer>
    <!-- </v-card> -->

  </v-app>
  
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  // データをこのコンポーネントにセットする必要がないため fetch() を使う

 data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      absolute:false,
      value:true,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '産学連携',
      bottomNav: "",
      color: '#FFF'
    }
  },
    created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.user = user ? user : {}
        //console.log(this.user.uid)
      } else {
        // No user is signed in.
        this.$router.push("/login")
      }
    })
  }
}
</script>
