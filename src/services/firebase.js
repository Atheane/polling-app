import firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyA-B3UKKOXPx67tF1Akx6U-6w0sxBG-_9A",
  authDomain: "polling-app-545e7.firebaseapp.com",
  databaseURL: "https://polling-app-545e7.firebaseio.com",
  projectId: "polling-app-545e7",
  storageBucket: "polling-app-545e7.appspot.com",
  messagingSenderId: "773705093035",
}

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.store = firebase.firestore;
    this.auth = firebase.auth;
  }

  get polls() {
    return this.store().collection('polls');
  }
}

export default new Firebase();