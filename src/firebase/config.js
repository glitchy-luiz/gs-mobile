// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; 
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//! Substitua abaixo pelas suas credencias do firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLXgtjtVEb7aqxdDOONIdB3WRmtAVvD8c",
  authDomain: "gs-mobile-74759.firebaseapp.com",
  projectId: "gs-mobile-74759",
  storageBucket: "gs-mobile-74759.firebasestorage.app",
  messagingSenderId: "703525102023",
  appId: "1:703525102023:web:4ed291f73065822d02b9e2",
  databaseURL: 'https://gs-mobile-74759-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getDatabase(app)
export { auth, db };