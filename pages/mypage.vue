<template>
<v-container>
<div>

<p>{{user.uid}}</p>
<p>{{user.displayName}}</p>
     <button v-on:click="logout">ログアウト</button> 
           <form action @submit.prevent="sendMessage" class="form">
        <textarea v-model="input" :disabled="!user"></textarea>
                             <v-text-field
                  label="Select Image"
                  @click="pickFile"
                  v-model="imageName"
                  prepend-icon="attach_file"
                ></v-text-field>
                <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="onFilePicked"
                />
        <v-btn color="info" type="submit" :disabled="!user" class="send-button">送信</v-btn>
      </form>

                <v-spacer></v-spacer>
<li v-for="(value,index) in text" :key="index">
  <!-- <p style="white-space: pre;">{{ value.text }}</p> -->
  <pre>{{ value.text }}</pre>
                  <img :src= "value.url" 
                  width=100px;
                  height=100px; >
                                  
                 </li>

  
</div>
</v-container>
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
        var docRef = db.collection("item");
        //データ取得の条件を指定して取得
        var query = docRef.where('id','==',user.uid);
        //取ってきたデータを全てtext配列に入れる

    //変更や追加された分だけ持ってくる
    query.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(item => {
          this.text.push(item.doc.data());
        })
    })

        //変更や追加を感知したら全部持ってくる
    //   query.onSnapshot((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       this.text.push(doc.data().text);
    //     });
    // }
    // );
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
                  //console.log(setDoc);
              });
            });
            
            // console.log(this.imageUrl);
            var setDoc = db.collection('item').doc().set(data);
             // フォームを空にする
            this.input = "";
            this.imageName= "",
            this.imageUrl = "",
            this.imageFile = ""
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
