<template>
  <div>
    <v-card>
      <p><button v-on:click="logout">ログアウト</button> 
        <v-icon>person</v-icon>
        {{user.displayName}}
      </p>
    </v-card>
    <v-card style="padding-top:10px;padding-bottom:10px;">
    <!-- <p>いいね！・閲覧履歴</p> -->
    <p>出品したお土産</p>
    <!-- <p>交換した商品</p> -->
    <p>取引中のお土産</p>
    <p>申請中のお土産</p>
    <nuxt-link to="/mypage/request_list"><p>届いた申請</p></nuxt-link>
    </v-card>
    <v-card>
        <p><span class="cyan--text">ガイド・お問い合わせ</span></p>
        <p>ガイド</p>
        <p>お問い合わせ</p>
        <p>Q&A</p>
    </v-card>
  </div>
</template>

<script>
import createPersistedState from 'vuex-persistedstate'
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  fetch ({ store, route,redirect }) {
      console.log("今からリダイレクト分岐");
    if (!store.state.user.user) {
      //console.log("リダイレクトなんだよなぁ")
      if(route.name != "/login"){
      return redirect('/login')
      }else{
       return redirect('/mypage/')
      }
    }
  },
  data() {
    return {
      user: {},  // ユーザー情報
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
        this.user = user ? user : {}
    })
  },
  methods : {
    ...mapActions(['setUser']), 
    logout() {
      const self = this
      firebase.auth().signOut()
      .then(_ => {
        console.log("ログアウト成功")
        this.$store.dispatch('user/fecthUser',)
        //self.$router.push("/login")
      }).catch((error) => {
        alert(error)
      })
    }
  },
  
};


</script>
<style scoped>
p {
  margin-left: 15px;
  margin-top: 10px;
}
</style>