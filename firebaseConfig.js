// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj8R-B24L4pfJ91xO_T0Gk2aGJ6qbcfaQ",
  authDomain: "panchapatchiuserapp.firebaseapp.com",
  databaseURL: "https://panchapatchiuserapp-default-rtdb.firebaseio.com",
  projectId: "panchapatchiuserapp",
  storageBucket: "panchapatchiuserapp.appspot.com",
  messagingSenderId: "906075995285",
  appId: "1:906075995285:web:c726198f7d94ba6993af9c",
  measurementId: "G-YSD4N7SLVL",
};

// Ensure we initialize Firestore with RN-friendly settings ONCE to avoid backend connection issues
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
} else {
  app = getApp();
}

export const db = getFirestore(app);
