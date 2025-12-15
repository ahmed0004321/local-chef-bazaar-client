// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr8y5RlrrLvHUHQBCssvVAxWeNXb0Q1-o",
  authDomain: "local-chef-bazaar-client.firebaseapp.com",
  projectId: "local-chef-bazaar-client",
  storageBucket: "local-chef-bazaar-client.firebasestorage.app",
  messagingSenderId: "146845968706",
  appId: "1:146845968706:web:f7cbb9b13721bcc33840db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);