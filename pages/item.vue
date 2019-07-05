<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-btn fab dark large color="black">
        <v-icon dark>person</v-icon>
      </v-btn >
      <a>{{ item.title }}</a>
       <v-container grid-list-sm fluid>
          <v-layout row wrap>
            <v-flex
              v-for="n in 6"
              :key="n"
              xs4
              d-flex
            >
            
              <v-card flat tile class="d-flex">

                <v-img
                  :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
                  :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                <v-layout column fill-height >
                  
                  <v-spacer></v-spacer>
                  <v-flex shrink xs1>
                  <div id="item_name">商品名</div>
                  </v-flex>
                </v-layout>
                  <template v-slot:placeholder>
                    <v-layout
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>
              </v-card>
            </v-flex>
          </v-layout>
          <br><div id ="kategori">
          <v-btn>{{item.category}}</v-btn>
          </div>
          <br><pre>{{item.text}}</pre>
          <br><div id="syonin">
              <nuxt-link :to="{path: '/select_item', query: {itemId: itemId }}">
                <v-btn large round color="yellow" dark>申請を作成</v-btn>
              </nuxt-link>
          </div>
        </v-container>
    </v-card> 
    </v-flex>
  </v-layout>
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
      item: '',  // 商品一覧
      input: '',  // 入力したメッセージ
      itemId : 'default ID',
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
      itemId: context.query['itemId']
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
        var docRef = db.collection("item").doc(this.itemId);
        
        docRef.get().then(doc => {
            if (doc.exists) {
                this.item = doc.data();
                // console.log(this.item);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });


    //変更や追加された分だけ持ってくる
    // docRef.onSnapshot(snapshot => {
    //     snapshot.docChanges().forEach(item => {
    //       //console.log(item.doc.id);
    //       //item.doc.data().item_id = item.doc.id;
    //         let data = {
    //         'itemId': item.doc.id,
    //         'title': item.doc.data().title,
    //         'url': item.doc.data().url
    //       }
    //       //console.log(item.doc.data);
    //       this.item.push(data);
    //     })
    // })

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
#item_name{
text-align: center;
background-color:darkgrey;
}
</style>
<style>
#kategori{
  text-align: center;
}
</style>
<style>
#syonin{
  text-align: center;
}
</style>
