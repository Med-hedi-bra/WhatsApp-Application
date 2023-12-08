// Import the functions you need from the SDKs you need
import  app  from "firebase/compat/app";
// import { getAnalytics } from "firebase/analytics";
import "firebase/compat/auth"
import "firebase/compat/database"
import "firebase/compat/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBconuVHsWz_KT65aUL_K0SnPatbu3vNZ0",
  authDomain: "whatsapptp-ac076.firebaseapp.com",
  projectId: "whatsapptp-ac076",
  storageBucket: "whatsapptp-ac076.appspot.com",
  messagingSenderId: "968755199609",
  appId: "1:968755199609:web:b8fe74ee28f2d72d3bdea8",
  measurementId: "G-XD1MCKLQJ3"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default firebase