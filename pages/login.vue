<template>
<v-layout justify-center>
<div style="margin-left:30px">
      <v-btn color="info" @click="twitterLogin">Twitterでログイン</v-btn>
     <v-spacer />
      <v-btn color="error" @click="googleLogin">Googleでログイン</v-btn>

  
</div>
  </v-layout>
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'


export default {
  //ログインしていたらマイページにリダイレクト
    fetch ({ store, route,redirect }) {
    if (store.state.user.user) {
      return redirect('/mypage')
    }
  },
    methods : {
      ...mapActions(['setUser']),

    twitterLogin () {
      var provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.$store.dispatch('user/fecthUser', "id" )
          this.$router.push("/mypage")
          // console.log("リダイレクトするはず")
        } else {
          this.$router.push("/login")
        }
      })
      
    },
    googleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
            firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.dispatch('user/fecthUser', "id" )
        this.$router.push("/mypage")
        //console.log(this.user)
        } else {
          // No user is signed in.
          this.$router.push("/login")
        }
      })
      
    }
    },
  
}

</script>