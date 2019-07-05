<template>
      <v-card light>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
         <v-container grid-list-md text-xs-center>
          <v-layout row wrap >
            <v-flex
              xs4
              md3
              v-for="(value,index) in item" :key="index"
              style="margin-left:0px"
            >
              <v-card flat tile style="width:100%">
                <nuxt-link :to="{path: '/item', query: {itemId: value.itemId }}">

                <img
                  :src= "value.url"
                  width="100%"
                  height="100px"
                  style = "object-fit: cover"
                >
                <p style="text-align:center">{{value.title}}</p>
                </nuxt-link>
              </v-card>
              
            </v-flex>
            
          </v-layout>
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
      item: [],  // 商品一覧
      input: '',  // 入力したメッセージ
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: ""
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
        var docRef = db.collection('users').doc(this.user.uid).collection('request');

    //変更や追加された分だけ持ってくる
    docRef.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(item => {

          console.log(item.doc.data());
          //this.item.push(data);
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
            // ストレージオブジェクト作成
            var storageRef = firebase.storage().ref();
            //ファイル名が被らないように一意な名前を作成
            this.imageName = uuid();
            // ファイルのパスを設定
            var mountainsRef = storageRef.child(`images/${this.imageName}`);
            // ファイルを適用してファイルアップロード開始
            mountainsRef.put(this.imageFile).then(snapshot => {
              snapshot.ref.getDownloadURL().then(downloadURL => {
                this.imageUrl = downloadURL;
                //db.collection("images").add({ downloadURL });
                    var time = timeCreate();
                    var data = {
                    id: user.uid,
                    name: user.displayName,
                    text: this.input,
                    category: "食べ物",
                    url: this.imageUrl,
                    created_at:time,
                  };
                  // console.log(this.imageUrl);
                  var setDoc = db.collection('item').doc().set(data);
                  this.input = "";
                  this.imageName= "",
                  this.imageUrl = "",
                  this.imageFile = ""
                  //console.log(setDoc);
              });
            });
          
        })
      },



    },
  
};


</script>