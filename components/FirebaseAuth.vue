<template>
  <div id="firebaseui-auth-container"/>
</template>

<script>

import firebase from "firebase";
import 'firebase/auth'
//var ui = new firebaseui.auth.AuthUI(firebase.auth());
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
};

const firebaseConfig = {
    apiKey: "AIzaSyB7QlmnVY6Kzf_CtZHqq-SfnNi1vhZ1km8",
    authDomain: "sangaku-e415d.firebaseapp.com",
    databaseURL: "https://sangaku-e415d.firebaseio.com",
    projectId: "sangaku-e415d",
    storageBucket: "",
    messagingSenderId: "178873445816",
    appId: "1:178873445816:web:d675f2928d039a05"

}
export default {
  mounted() {
    if (!firebase.apps.length && process.browser) {
      require('firebaseui/dist/firebaseui.css');
      const firebaseui = require('firebaseui');
      firebase.initializeApp(firebaseConfig);
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  },
}

</script>