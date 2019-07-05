<template>
      <v-card light>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
         <v-container grid-list-md text-xs-center>
          <v-layout row wrap class="scroll">
            
            <v-flex
              xs4
              md3
              v-for="(value,index) in item" :key="index"
              style="margin-left:0px"
            >
              <v-card flat tile style="width:100%">
                <input type="checkbox" :id="value.item_id" :value="value.item_id" v-model="checkedNames"
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
          v-model="input"
          label=""
          value=""
          height=150
        ></v-textarea>
      </v-flex>
            <v-btn large round color="yellow" dark>申請を送信</v-btn>
        </v-container>
        
      </v-card>
      
</template>

<script>
import createPersistedState from 'vuex-persistedstate'
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
import uuid from 'uuid'
// import Vue from 'vue'
// new Vue({
//   el: '#example-3',
//   data: {
//     checkedNames: []
//   }
// })
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
      input: '',  // 入力したメッセージ
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: "",
      checkedNames: [],
      checked:false
    }
  },
  mounted() {

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
            if(this.checkedNames.length <= 1){
              this.checked = true;
            }else{
              this.checked = false;
            }
    console.log(this.checkedNames);
    },
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
                  var setDoc = db.collection('item').doc().set(data);
                  this.input = "";
                  this.imageName= "",
                  this.imageUrl = "",
                  this.imageFile = ""
              });
            });
          
        })
      },
      timeCreate() {
        var d = new Date();
        var year  = d.getFullYear();
        var month = d.getMonth() + 1;
        var day   = d.getDate();
        var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
        var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
        var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
        var time = ( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
        return time;
      },
      pickFile() {
      this.$refs.image.click();
    },
    //ファイルの選択変えた時に動きそう
     onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },

    // 画像アップロード処理
    upload: function() {
      var me = this;
      const db = firebase.firestore();
      // ストレージオブジェクト作成
      var storageRef = firebase.storage().ref();
      // ファイルのパスを設定
      var mountainsRef = storageRef.child(`images/${this.imageName}`);
      // ファイルを適用してファイルアップロード開始
      mountainsRef.put(this.imageFile).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          this.imageUrl = downloadURL;
          db.collection("images").add({ downloadURL });
        });
      });
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
<style>

        .scroll {
        height: 300px;
        overflow-y: scroll;
    }
</style>