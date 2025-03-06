import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";


  const firebaseConfig = {
    apiKey: "AIzaSyC5ZSuw4l5wL4MZasI1fQwV_lr2sxodKCU",
    authDomain: "optiway-d6ee4.firebaseapp.com",
    databaseURL: "https://optiway-d6ee4-default-rtdb.firebaseio.com",
    projectId: "optiway-d6ee4",
    storageBucket: "optiway-d6ee4.firebasestorage.app",
    messagingSenderId: "14870803551",
    appId: "1:14870803551:web:6d0d744abe64f53ba797ea",
    measurementId: "G-ZEMVWZ0MY9"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);
export { auth, db, database };