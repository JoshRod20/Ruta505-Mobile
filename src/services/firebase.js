import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mismo proyecto de Firebase que la PWA — misma colección "users",
// mismas reglas de Firestore, mismas cuentas de Authentication.
const firebaseConfig = {
  apiKey: "AIzaSyDwzL-hLoWpblezYIYlIJXNkPaTAAdXlZ8",
  authDomain: "ruta505.firebaseapp.com",
  projectId: "ruta505",
  storageBucket: "ruta505.firebasestorage.app",
  messagingSenderId: "65945086045",
  appId: "1:65945086045:web:36e92b414a14b744fe45b4",
  measurementId: "G-ELKCD18NDZ",
};

const appfirebase = initializeApp(firebaseConfig);

// En React Native, Auth necesita que le digamos explícitamente dónde
// guardar la sesión (AsyncStorage) — a diferencia del navegador, que
// usa localStorage automáticamente. Sin esto, el usuario tendría que
// volver a iniciar sesión cada vez que cierra la app.
const auth = initializeAuth(appfirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore en React Native ya maneja su propia persistencia offline
// de forma automática (no usa persistentLocalCache, que es una API
// específica para navegadores web con IndexedDB).
const db = getFirestore(appfirebase);

export { appfirebase, auth, db };