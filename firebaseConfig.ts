// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClOhHIYB4BhYZCu_2XKErdeqrF645XMrc",
  authDomain: "fitlens-b7a6b.firebaseapp.com",
  projectId: "fitlens-b7a6b",
  storageBucket: "fitlens-b7a6b.firebasestorage.app",
  messagingSenderId: "1078521285362",
  appId: "1:1078521285362:web:c30ead3e5e5839d1349e6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);