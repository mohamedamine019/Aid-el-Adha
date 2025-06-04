// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARHHtpqI0LjpdUvS-ONI8y_A4cBY1AJtk",
  authDomain: "aid-el-adha-by-amine.firebaseapp.com",
  projectId: "aid-el-adha-by-amine",
  storageBucket: "aid-el-adha-by-amine.firebasestorage.app",
  messagingSenderId: "842963524088",
  appId: "1:842963524088:web:dc22c647745710e9525e0d",
  measurementId: "G-XS3KHPTXMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };