<template>
<div>

<p>{{user.uid}}</p>
<p>{{user.displayName}}</p>
<v-btn color="info" @click="kakikomi">書き込みスイッチ</v-btn>
     <button v-on:click="logout">ログアウト</button>
<li v-for="(value,index) in text" :key="index">
  {{ value }}</li>
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
       return redirect('/mypage')
      }
    }
    
  },
    data() {
    return {
      user: {},  // ユーザー情報
      text: [],  // 取得したメッセージを入れる配列
      input: ''  // 入力したメッセージ
    }
    //console.log(user);
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        //userにログインしているユーザーのデータを入れる
        this.user = user ? user : {}
        //firestore設定
        const db = firebase.firestore()
        //itemコレクションを選択（コレクションについては各自調べてください）
        var docRef = db.collection("item");
        //データ取得の条件を指定して取得
        var query = docRef.where('id','==',user.uid).get()
        //取ってきたデータを全てtext配列に入れる
        .then(snapshot => {
          snapshot.forEach(doc => {

            this.text.push(doc.data().text);
            //console.log(doc.id, '=>', doc.data().text);

          });
        }).catch(err => {
          console.log('Error getting documents', err);
        });

      } else {
        // No user is signed in.
        //this.$router.push("/login")
      }
    })
  },
    methods : {
      ...mapActions(['setUser']), 
      kakikomi(){
        firebase.auth().onAuthStateChanged(user => {
            this.user = user ? user : {}
            //console.log(this.user.uid)
            const db = firebase.firestore()
            var data = {
              id: user.uid,
              name: 'おちょおちょとちぃドアノブべろちょ２',
              text: 'おちょおちょとちぃドアノブべろちょ２',
            };
            var setDoc = db.collection('item').doc().set(data);
        })
      },
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
