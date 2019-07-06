<template>
<div>
    <v-tabs
    centered
    color="glLight grayay"
    dark
    icons-and-text
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>

    <v-tab href="#tab-1">
      出品中の商品
    </v-tab>

    <v-tab 
    color="teal"
          flat
          value="recent"
          to="trans">
      取引中の商品
    </v-tab>

    <v-tab href="#tab-3">
      申請中の商品
    </v-tab>

    <v-tab-item
      v-for="i in 3"
      :key="i"
      :value="'tab-' + i"
    >

    </v-tab-item>
  </v-tabs>
      <v-list three-line>
        <div v-for="(item, index) in item" :key="index" >
          <nuxt-link :to="{path: '/mypage/request_detail', query: {requestId: item.request_id }}">


          <v-list-tile
            :key="item.user_name"
            user_photo
            
          >
            <v-list-tile-avatar>
              <img :src="item.user_photo">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="item.user_name"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.text"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          </nuxt-link>
        </div>
      </v-list>
</div>
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
            let data = {
            'request_id': item.doc.id,
            'user_name': item.doc.data().user_name,
            'user_photo': item.doc.data().user_photo,
            'text': item.doc.data().text
          }
          //console.log(item.doc.data());
           this.item.push(data);
        })
    })

    })
  },
    methods : {
      ...mapActions(['setUser']), 
    },
  
};


</script>
<style>
a{
  text-decoration: none !important;
}
</style>