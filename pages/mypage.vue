<template>
<div>

<p>{{user.uid}}</p>
<p>{{user.displayName}}</p>
     <button v-on:click="logout">ログアウト</button>
           <form action @submit.prevent="sendMessage" class="form">
        <textarea v-model="input" :disabled="!user"></textarea>
        <v-btn color="info" type="submit" :disabled="!user" class="send-button">送信</v-btn>
      </form>
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
        // User is signed in.
        //userにログインしているユーザーのデータを入れる
        this.user = user ? user : {}
        //firestore設定
        const db = firebase.firestore()
        //itemコレクションを選択（コレクションについては各自調べてください）
        var docRef = db.collection("item");
        //データ取得の条件を指定して取得
        var query = docRef.where('id','==',user.uid);
        //取ってきたデータを全てtext配列に入れる

    //変更や追加を感知したら全部持ってくる
    //   query.onSnapshot((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       this.text.push(doc.data().text);
    //     });
    // }
    // );

    //変更や追加された分だけ持ってくる
    query.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(item => {
          this.text.push(item.doc.data().text);
        })
    })

 



    })
  },
    methods : {
      ...mapActions(['setUser']), 
      sendMessage(){
        firebase.auth().onAuthStateChanged(user => {
            this.user = user ? user : {}
            //console.log(this.user.uid)
            const db = firebase.firestore()
            var data = {
              id: user.uid,
              name: 'おちょおちょとちぃドアノブべろちょ２',
              text: this.input,
            };
            var setDoc = db.collection('item').doc().set(data);
            this.input = ""; // フォームを空にする
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
