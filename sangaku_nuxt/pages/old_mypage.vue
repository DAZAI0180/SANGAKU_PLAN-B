<template>
 <div>
    <v-btn color="success">Success</v-btn>
    <v-btn color="error">Error</v-btn>
    <v-btn color="warning">Warning</v-btn>
    <v-btn color="info">{{ user.displayName }}</v-btn>
    <p>{{ user.uid }}</p>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
//import Nl2br from 'vue-nl2br'
  export default {
  
  /*export default {
    async asyncData ({ app }) {
      const data = await app.$axios.$get('http://localhost:8000/api/sega?ore=kimi')
      return { data }
    }
  }*/
    data() {
    return {
      user: {},  // ユーザー情報
      chat: [],  // 取得したメッセージを入れる配列
      input: ''  // 入力したメッセージ
    }
    console.log(user);
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.user = user ? user : {}
        console.log(this.user.uid)
      } else {
        // No user is signed in.
      }
    })
  }
  
};
//console.log(this.user.uid);

//WNwR7CYl4LaJG9mmRs57L9J9XKP2
</script>