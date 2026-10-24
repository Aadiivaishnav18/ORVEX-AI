// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9MTJZNnN-Nd2e8ZAvgdTS2i4Z2Qz2jgE",
  authDomain: "orvex-ai-19221.firebaseapp.com",
  projectId: "orvex-ai-19221",
  storageBucket: "orvex-ai-19221.firebasestorage.app",
  messagingSenderId: "199909830017",
  appId: "1:199909830017:web:b73d687feea82f5d668c80",
  measurementId: "G-93X5BQNW4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);