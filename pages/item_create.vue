<template>
  <v-layout>

    <v-flex>
      <form action @submit.prevent="putUp" class="form">
      <p style="width:100%; margin:10px 0 13px 0; background-color:gray; color:white;line-height:200%">
        &emsp;商品名を入力してください
      </p>
      <v-flex xs12 sm6 md3>
        <v-text-field
          label=""
          solo
          v-model="title"
        ></v-text-field>
      </v-flex>

      <p style="width:100%; margin:0px 0 13px 0; background-color:gray; color:white;line-height:200%">
        &emsp;画像を追加してください
      </p>
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
  <!-- <div class="contents">
    <label v-show="!uploadedImage" class="input-item__label"
      >画像を選択
      <input type="file" @change="onFileChange" />
    </label>
    <div class="preview-item">
      <img
        v-show="uploadedImage"
        class="preview-item-file"
        :src="uploadedImage"
        alt=""
        width="100px"
      />
      <div v-show="uploadedImage" class="preview-item-btn" @click="remove">
        <p class="preview-item-name">{{ img_name }}</p>
        <e-icon class="preview-item-icon">close</e-icon>
      </div>
    </div>
  </div> -->
      <p style="width:100%; margin:10px 0 13px 0; background-color:gray; color:white;line-height:200%">
        &emsp;商品の説明を入力してください
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
      <v-flex xs12>
          <v-btn color="red" round large type="submit" style="width:44%">出品する</v-btn>
          <v-btn color="blue" round large style="width:44%">キャンセル</v-btn>
      </v-flex>
      </form>
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
      input: '',  // 入力したメッセージ
      title: '',
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: "",
      //危険度５
      uploadedImage: '',
      img_name: '',
    }
  },
  
    methods : {
      ...mapActions(['setUser']), 
      putUp(){
        firebase.auth().onAuthStateChanged(user => {
            this.user = user ? user : {}
            //console.log(this.user.uid)
            const db = firebase.firestore()
            // ストレージオブジェクト作成
            var storageRef = firebase.storage().ref();
            //ファイルの名前を一意にする
            this.imageName = uuid();
            // ファイルのパスを設定
            var mountainsRef = storageRef.child(`images/${this.imageName}`);
            // ファイルを適用してファイルアップロード開始
            mountainsRef.put(this.imageFile).then(snapshot => {
              snapshot.ref.getDownloadURL().then(downloadURL => {
                this.imageUrl = downloadURL;
                    const itemInputData = {
                    user_id: user.uid,
                    user_photo:user.photoURL,
                    user_name: user.displayName,
                    item_name:this.title,
                    item_text: this.input,
                    category: "食べ物",
                    image_url: this.imageUrl,
                    created_at:new Date(),
                  };

                  db.collection('item').add(itemInputData)
                  .then(docRef => {
                    const usersInputData = {
                    item_id: docRef.id,
                    user_photo:user.photoURL,
                    user_name: user.displayName,
                    item_name:this.title,
                    text: this.input,
                    category: "食べ物",
                    image_url: this.imageUrl,
                    created_at:new Date(),
                  };
                    db.collection("users/"+this.user.uid+"/item").doc().set(usersInputData);
                    this.input = "";
                    this.imageName= "",
                    this.imageUrl = "",
                    this.imageFile = "",
                    this.title = ""
                  }).then(_ => {
            this.$router.push("/")
          });
              });
            });
            
        })
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
      },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.createImage(files[0]);
      this.img_name = files[0].name;
    },
    // アップロードした画像を表示
    createImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.uploadedImage = e.target.result;
        console.log(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    remove() {
      this.uploadedImage = false;
    },
    }
    
  
};


</script>
<style>
label > input {
  display: none;
}

label {
  padding: 0 1rem;
  border: solid 1px #888;
} 

label::after {
  content: '+';
  font-size: 1rem;
  color: #888;
  padding-left: 1rem;
}
</style>