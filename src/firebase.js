
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "msbank-dfab6.firebaseapp.com",
  databaseURL: "https://msbank-dfab6-default-rtdb.firebaseio.com",
  projectId: "msbank-dfab6",
  storageBucket: "msbank-dfab6.appspot.com",
  messagingSenderId: "283506523535",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-8KYJS86GT5"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;

export const db = getFirestore(app);
