//import firebase from 'firebase/app';
import 'firebase/auth';
import firebase from 'firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyB7QlmnVY6Kzf_CtZHqq-SfnNi1vhZ1km8",
    authDomain: "sangaku-e415d.firebaseapp.com",
    databaseURL: "https://sangaku-e415d.firebaseio.com",
    projectId: "sangaku-e415d",
    storageBucket: "",
    messagingSenderId: "178873445816",
    appId: "1:178873445816:web:d675f2928d039a05"
  })
}

export default firebase
