<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-btn fab dark small color="black">
        <v-icon dark>person</v-icon>
      </v-btn >
      <a>{{item.name}}</a>
      <v-spacer></v-spacer>
      <p id="time">{{item.created_at}}</p>
       <v-container grid-list-sm fluid>
          <v-layout row wrap>
            <v-flex>
            
              <v-card flat tile class="d-flex">

                <v-img
                  :src="item.url"
                  :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                <v-layout column fill-height >
                  
                  <v-spacer></v-spacer>
                  <v-flex shrink xs1>
                  <div id="item_name">{{item.title}}</div>
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
          <br><v-pre xs1>{{item.text}}</v-pre>
          <br>
          <div id="syonin">
            <nuxt-link :to="{path: '/request_edit', query: {itemId: itemId ,userId:item.id}}">
                <v-btn large round color="yellow">申請を作成</v-btn>
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
      item: '',  // 商品一覧
      itemId : 'default ID',
      dialog: false,
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
    })
  },
    methods : {
      ...mapActions(['setUser']), 
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
