import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyD3iKvFQGtPp2jGSayxYBJUc2K9JyX4370",
    authDomain: "practice-5009b.firebaseapp.com",
    projectId: "practice-5009b",
    storageBucket: "practice-5009b.firebasestorage.app",
    messagingSenderId: "578053620392",
    appId: "1:578053620392:web:b107a89d1a39ede85ff89d",
    measurementId: "G-D2VJSTGFCC"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, GoogleAuthProvider, googleProvider, signInWithPopup}