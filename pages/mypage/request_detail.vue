<template>
<v-container grid-list-md text-xs-center>
    <maincard />
    <div class="item">
        <p> 出品した商品 </p>
        
        <img
        :src= "targetItem.url"
        width="200px"
        height="100px"
        style = "object-fit: cover"       
        >
    </div>
    <p>{{targetItem.title}}</p>
    <v-layout row wrap >
      
      <v-flex
        xs4
        md3
      >
        <v-card flat tile style="width:100%">
            <nuxt-link :to="{path: '/item_detail', query: {itemId: item1.itemId }}">
          <img
            :src= "item1.url"
            width="100%"
            height="100px"
            style = "object-fit: cover"
          >
          <p class="notNewLine">{{item1.title}}</p>
            </nuxt-link>
            <v-layout justify-center>
              <input type="radio" :id="item1.itemId" :value="item1.itemId" v-model="picked" style="display:none;">
              <v-btn :color="btnColor1" v-on:click="itemSelect(item1.itemId,'item1')">これならOK</v-btn>
            </v-layout>
        </v-card>
      </v-flex>

      <v-flex
        xs4
        md3
      >
        <v-card flat tile style="width:100%" v-show="item2.itemId">
            <nuxt-link :to="{path: '/item_detail', query: {itemId: item2.itemId }}">
          <img
            :src= "item2.url"
            width="100%"
            height="100px"
            style = "object-fit: cover"
          >
          <p class="notNewLine">{{item2.title}}</p>
            </nuxt-link>
            <v-layout justify-center>
              <input type="radio" :id="item2.itemId" :value="item2.itemId" v-model="picked" style="display:none;">
              <v-btn :color="btnColor2" v-on:click="itemSelect(item2.itemId,'item2')">これならOK</v-btn>
            </v-layout>
        </v-card>
         
      </v-flex>
      <v-flex
        xs4
        md3
      >
        <v-card flat tile style="width:100%" v-show="item3.itemId">
          <nuxt-link :to="{path: '/item_detail', query: {itemId: item3.itemId }}">
          <img
            :src= "item3.url"
            width="100%"
            height="100px"
            style = "object-fit: cover"
          >
          <p class="notNewLine">{{item3.title}}</p>
          </nuxt-link>
          <v-layout justify-center>
            <input type="radio" :id="item3.itemId" :value="item3.itemId" v-model="picked" style="display:none;">
            <v-btn :color="btnColor3" v-on:click="itemSelect(item3.itemId,'item3')">これならOK</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
   <p>{{requestData.text}}</p>
    <!-- <span>Picked: {{ picked }}</span> -->
    <v-btn class="align-center" type="submit" :disabled="!checked" large round color="yellow" >申請を許可</v-btn>
    </v-container>
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
       return redirect('/mypage/')
      }
    }
    
  },
    data() {
    return {
      user: {},  // ユーザー情報
      requestData: {},  // 商品一覧
      items: [],
      item1:{},
      item2:{},
      item3:{},
      targetItem:{},
      requestId : 'default ID',
      dialog: false,
      picked:'',
      checked:false,
      btnColor1:"",
      btnColor2:"",
      btnColor3:""
      
    }
    //console.log(user);
  },
    asyncData(context) {
    return {
      requestId: context.query['requestId']
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
        var docRef = db.collection("users").doc(this.user.uid).collection("request").doc(this.requestId);
        docRef.get().then(doc => {
            if (doc.exists) {
                 this.requestData = doc.data()
                // console.log(this.test);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(_=>{
          const item1_id = this.requestData.item1_id;
          const item2_id = this.requestData.item2_id;
          const item3_id = this.requestData.item3_id;
          const itemDocRef = db.collection("item");

          itemDocRef.doc(item1_id).get().then(doc => {
            let data = {
              'itemId': doc.id ? doc.id: false,
              'title': doc.data().title ? doc.data().title : '',
              'url': doc.data().url ? doc.data().url : '',
            }
                this.item1 = data;
        })

          itemDocRef.doc(item2_id).get().then(doc => {
            let data = {
              'itemId': doc.id ? doc.id: false,
              'title': doc.data().title ? doc.data().title : '',
              'url': doc.data().url ? doc.data().url : '',
            }
                this.item2= data;
        })

          itemDocRef.doc(item3_id).get().then(doc => {
            let data = {
              'itemId': doc.id ? doc.id: false,
              'title': doc.data().title ? doc.data().title : '',
              'url': doc.data().url ? doc.data().url : '',
            }
                this.item3 = data;
        })

          itemDocRef.doc(this.requestData.target_user_id).get().then(doc => {
            let data = {
              'itemId': doc.id ? doc.id: false,
              'title': doc.data().title ? doc.data().title : '',
              'url': doc.data().url ? doc.data().url : '',
            }
                this.targetItem = data;
        })

        });
         
    });
    
  },
    methods : {
      ...mapActions(['setUser']), 

      //ラジオボタン関連の処理
      itemSelect(checkItem,itemPosition){
        this.picked = checkItem
        this.checked = true
        this.btnColor1 = itemPosition == "item1" ? "success" : "";
        this.btnColor2 = itemPosition == "item2" ? "success" : "";
        this.btnColor3 = itemPosition == "item3" ? "success" : "";
      }
    },
  
};
</script>

<style scoped>
.item {
  padding: 0;
  color: #2c2c2f;
  /* background: red; 背景色 */
}
.item p {
  font-size: 20px;
  margin: 0;
  padding: 0;
}


/*改行させるかよ*/
.notNewLine{
  text-align:center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

