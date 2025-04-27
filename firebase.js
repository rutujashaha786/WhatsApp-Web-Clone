// Import the functions you need from the SDK
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFpX1-R-oZyxk7agq2NaGIPVBcEzO9eMw",
  authDomain: "whatsapp-clone-233fa.firebaseapp.com",
  projectId: "whatsapp-clone-233fa",
  storageBucket: "whatsapp-clone-233fa.appspot.com",
  messagingSenderId: "124911190179",
  appId: "1:124911190179:web:426c7ae871f45ebbe23f16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage();

export {auth, db, storage}
