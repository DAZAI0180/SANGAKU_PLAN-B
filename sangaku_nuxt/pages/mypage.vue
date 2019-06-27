<template>
<div>

<p>{{user.uid}}</p>
<p>{{user.displayName}}</p>
<v-btn color="info" @click="kakikomi">書き込みスイッチ</v-btn>
     <button v-on:click="logout">ログアウト</button>
</div>
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'

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
    //console.log(user);
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.user = user ? user : {}
        this.$store.commit('login', user)
        //console.log(this.user.uid)
        const db = firebase.firestore()
        var docRef = db.collection("item");
        var query = docRef.where('id','==',user.uid).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
          });
        }).catch(err => {
          console.log('Error getting documents', err);
        });

      } else {
        // No user is signed in.
        //this.$router.push("/login")
      }
    })
  },
    methods : {
      ...mapActions(['setUser']),
      kakikomi(){
        firebase.auth().onAuthStateChanged(user => {
            this.user = user ? user : {}
            //console.log(this.user.uid)
            const db = firebase.firestore()
            var data = {
              id: user.uid,
              text: 'おちょおちょとちぃドアノブべろちょ２',
            };
            var setDoc = db.collection('item').doc().set(data);
        })
      },
      logout() {
        const self = this
        firebase.auth().signOut()
        .then(_ => {
          this.setUser(null)
          console.log("ログアウト成功")
          //self.$router.push("/login")
        }).catch((error) => {
          alert(error)
        })
      }
    },
  
};
  // const db = firebase.firestore()
  // var docRef = db.collection("item");
  // console.log(userid);
  // var query = docRet.where('id','==',user.uid)

  // docRef.get().then(function(doc) {
  //     if (doc.exists) {
  //         console.log("Document data:", doc.data());
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //     }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  // });

</script>
