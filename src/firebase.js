import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBQy0itTrfG_q13q8Yh97EIxvrW5_7dpIo",
    authDomain: "gplusremade.firebaseapp.com",
    databaseURL: "https://gplusremade.firebaseio.com",
    projectId: "gplusremade",
    storageBucket: "gplusremade.appspot.com",
    messagingSenderId: "344534602769",
    appId: "1:344534602769:web:0afa834721547adce0cdb0",
    measurementId: "G-EGYNWNFR73"
});

const db = firebaseApp.firestore();

const storage = firebase.storage().ref();

export { db, storage };
