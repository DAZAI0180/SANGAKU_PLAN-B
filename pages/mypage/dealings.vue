<template>
      <v-container>

   <!-- ▼LINE風ここから -->
    
        <div class="line__container">
            <!-- タイトル -->
            <div class="line__title">
                チャットエリア
            </div>

            <!-- ▼会話エリア scrollを外すと高さ固定解除 -->
            <div class="line__contents scroll" id ="chatarea">
              <div v-for="(value,index) in text" :key="index">
              {{ value.name }}
              <div class="line__left">
                <div class="text">
                  <pre>{{value.message}}</pre>
                  <!-- <div v-html="$sanitize(value.message)"></div> -->
                </div>
              </div>          
            <!-- ここにチャットログが入る -->
            </div>

          </div>
            <!--　▲会話エリア ここまで -->

        </div>
    <!--　▲LINE風 ここまで -->
      <form action @submit.prevent="sendMessage" class="form">
          <v-flex xs12>
            <v-textarea
              outline
              name="input-7-4"
              label="何か送ってみましょう"
              value=""
              v-model="message"
            ></v-textarea>
          </v-flex>
          <v-layout justify-center>
          <v-btn type="submit" large color="error">メッセージを送る</v-btn>
          
          </v-layout>
      </form>
        
        
      </v-container>
      
</template>

<script>
import createPersistedState from 'vuex-persistedstate'
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
import '@/assets/css/chat.css'
import sanitizeHTML from 'sanitize-html'
import Vue from 'vue'
Vue.prototype.$sanitize = sanitizeHTML

export default {
  
  fetch ({ store, route,redirect }) {
    if (!store.state.user.user) {
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
      message: '',  // 入力したメッセージ
      title: '',
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: ""
    }
    //console.log(user);
  },
  asyncData(context) {
    return {
      dealingsId: context.query['dealingsId']
    }
  },
  
  created() {
    firebase.auth().onAuthStateChanged(user => {
        // User is signed in.
        //userにログインしているユーザーのデータを入れる
        this.user = user ? user : {}
        //firestore設定
        const db = firebase.firestore()
        //itemコレクションを選択（コレクションについては各自調べてください）
        var docRef = db.collection("chat").doc(this.dealingsId).collection("messages");
        //データ取得の条件を指定して取得

        //変更や追加された分だけ持ってくる
        docRef.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(item => {
              // console.log(item.doc.data());
              this.text.push(item.doc.data());
            })
        })

    })
  },
  methods : {
    ...mapActions(['setUser']), 
    sendMessage(){
      firebase.auth().onAuthStateChanged(user => {
        this.user = user ? user : {}
        const db = firebase.firestore()
            var data = {
            id: user.uid,
            name: user.displayName,
            message: this.message,
            created_at:new Date(),
          };
          var setDoc = db.collection("chat").doc(this.dealingsId).collection("messages").doc().set(data);
          this.user = "";
          this.message = "";

      })
    },
  },
  br2nl(){
      return str.replace(/\n/g, '<br>');
  }
  
};


</script>