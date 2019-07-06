<template>
      <v-card light>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
         <v-container grid-list-md text-xs-center>
           <form action @submit.prevent="sendRequest" class="form">
          <v-layout row wrap class="scroll">
            
            <v-flex
              xs4
              md3
              v-for="(value,index) in item" :key="index"
              style="margin-left:0px"
            >
              <v-card flat tile style="width:100%">
                <input type="checkbox" :id="value.item_id" :value="value.item_id" v-model="checkedItems"
                style="position:relative;top:25px;right:50px" v-on:change="selectCount">
                <label :for="value.item_id">
                <img
                  :src= "value.url"
                  width="100%"
                  height="100px"
                  style = "object-fit: cover"
                >
                </label>
                <p style="text-align:center">{{value.title}}</p>
              </v-card>
              
            </v-flex>
            
          </v-layout>
                <p style="width:100%; margin:10px 0 13px 0; background-color:gray; color:white;line-height:200%">
        &emsp;メッセージを添えてみましょう
      </p>
      <v-flex xs12>
        <v-textarea
          solo
          name="input-7-4"
          v-model="message"
          label=""
          value=""
          height=150
        ></v-textarea>
      </v-flex>
            <v-btn type="submit" :disabled="!checked" large round color="yellow" dark>申請を送信</v-btn>
            </form>
        </v-container>
        
      </v-card>
      
</template>

<script>
import createPersistedState from 'vuex-persistedstate'
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
import uuid from 'uuid'

  export default {
  
      fetch ({ store, route,redirect }) {
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
      item: [],  // 商品一覧
      message: '',  // 入力したメッセージ

      dialog: false,
      checkedItems: [],
      itemId : 'default ID',
      userId : 'default ID',
      checked:true
    }
  },
  asyncData(context) {
    return {
      itemId: context.query['itemId'],
      userId: context.query['userId']
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
        var docRef = db.collection("users/"+this.user.uid+"/item");
        // var query = docRef.orderBy("created_at", "asc");

      //変更や追加された分だけ持ってくる
      docRef.onSnapshot(snapshot => {
          snapshot.docChanges().forEach(item => {
            this.item.push(item.doc.data());
            
          })
      })
     })
  },
    methods : {
      ...mapActions(['setUser']), 
      selectCount(id){
        console.log(this.checkedItems)
        if(this.checkedItems.length == 0){
          this.checked = false;
        }else if(this.checkedItems.length <= 3){
          this.checked = true;
        }else{
          this.checked = false;
        }
    },
      sendRequest(){
        firebase.auth().onAuthStateChanged(user => {
            this.user = user ? user : {}
            const db = firebase.firestore()
            var data = {
            user_id: user.uid,
            user_name: user.displayName,
            user_photo: user.photoURL,
            target_item_id: this.itemId,
            item1_id: this.checkedItems[0] ? this.checkedItems[0] : '',
            item2_id: this.checkedItems[1] ? this.checkedItems[1] : '',
            item3_id: this.checkedItems[2] ? this.checkedItems[2] : '',
            text: this.message,
            created_at:new Date(),
          };
          db.collection('users').doc(this.userId).collection('request').doc().set(data).then(_ => {
            this.$router.push("/")
          });

        })
      },
    },
  
};
</script>
<style>

        .scroll {
        height: 400px;
        overflow-y: scroll;
    }
</style>