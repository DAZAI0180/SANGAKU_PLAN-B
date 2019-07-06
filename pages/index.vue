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
                <nuxt-link :to="{path: '/item_detail', query: {itemId: value.itemId }}">

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
      item: [],  // 商品一覧
      input: '',  // 入力したメッセージ
      dialog: false,
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
        var docRef = db.collection("item").orderBy("created_at", "desc");
        //データ取得の条件を指定して取得

    //変更や追加された分だけ持ってくる
    docRef.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(item => {
          //console.log(item.doc.id);
          //item.doc.data().item_id = item.doc.id;
            let data = {
            'itemId': item.doc.id,
            'title': item.doc.data().title,
            'url': item.doc.data().url
          }
          //console.log(item.doc.data);
          this.item.push(data);
        })
    })


    })
  },
    methods : {
      ...mapActions(['setUser']), 
      // timeCreate() {
      //   var d = new Date();
      //   var year  = d.getFullYear();
      //   var month = d.getMonth() + 1;
      //   var day   = d.getDate();
      //   var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
      //   var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
      //   var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
      //   var time = ( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
      //   return time;
      // },





    },
  
};


</script>
<style>
a{
  text-decoration: none !important;
}
</style>