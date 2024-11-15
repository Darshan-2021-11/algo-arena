import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "algoarena-99000.firebaseapp.com",
    projectId: "algoarena-99000",
    storageBucket: "algoarena-99000.firebasestorage.app",
    messagingSenderId: "27440046942",
    appId: "1:27440046942:web:82cec2639d4b14c534a5cf",
    measurementId: "G-G7LP8S7K8E"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)

export {app, auth}