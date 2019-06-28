//import firebase from 'firebase/app';
import 'firebase/auth';
import firebase from 'firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBsZEgFl80r9iIvffPjcTka-sBv8b51uvM",
    authDomain: "sangakuproject-e6177.firebaseapp.com",
    databaseURL: "https://sangakuproject-e6177.firebaseio.com",
    projectId: "sangakuproject-e6177",
    storageBucket: "",
    messagingSenderId: "459633720918",
    appId: "1:459633720918:web:cdc88d907e6f7882"
  })
}

export default firebase
