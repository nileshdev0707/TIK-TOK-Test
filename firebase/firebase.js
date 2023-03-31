import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAuEGt4iJvHFoeshMyXaE5O9GzujcJVNc",
  authDomain: "one-click-75771.firebaseapp.com",
  databaseURL: "https://one-click-75771-default-rtdb.firebaseio.com",
  projectId: "one-click-75771",
  storageBucket: "one-click-75771.appspot.com",
  messagingSenderId: "311679848791",
  appId: "1:311679848791:web:5786c2d05fc3a05c03ee12",
  measurementId: "G-SWKRJDDS2Q"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// export
export { app, auth, firestore, storage };
