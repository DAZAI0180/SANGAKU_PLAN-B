<template>
<v-layout justify-center>
<div style="margin-left:30px">
      <v-btn color="info" @click="twitterLogin">Twitterでログイン</v-btn>
     <v-spacer />
      <v-btn color="error" @click="googleLogin">Googleでログイン</v-btn>
  <div v-if='user' id="loader">
    <p>{{user.uid}}</p>
    <p>{{user.displayName}}</p>
    <!-- <button @click="logout">ログアウト</button> -->
  </div>
  
</div>
  </v-layout>
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'


export default {
  
  /*export default {
    async asyncData ({ app }) {
      const data = await app.$axios.$get('http://localhost:8000/api/sega?ore=kimi')
      return { data }
    }
  }*/
  data() {
    return {
      user: {},  // ユーザー情報
      chat: [],  // 取得したメッセージを入れる配列
      input: ''  // 入力したメッセージ
    }
  },
mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.user = user ? user : {}
        //this.$store.commit('login', user)
        //console.log(this.user)
      } else {
        //console.log('no login')
        // No user is signed in.
      }
    })
  },
    methods : {
      ...mapActions(['setUser']),

    twitterLogin () {
      var provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
      firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.dispatch('user/fecthUser', "id" )
        //this.$store.commit('login', user)
        //console.log(this.user)
      } else {
        //console.log('no login')
        // No user is signed in.
      }
    })
      
    },
        googleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
      
    },
    logout () {
      firebase.auth().signOut()
      this.$store.dispatch('user/fecthUser', null )
    }
      /*
      logout() {
        firebase.auth().signOut()
        .then(() => {
          this.setUser(null)
        }).catch((error) => {
          alert(error)
        })
      }
      */
    },
  
}

</script>