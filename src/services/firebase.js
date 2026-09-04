import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mismo proyecto de Firebase que la PWA — misma colección "users",
// mismas reglas de Firestore, mismas cuentas de Authentication.
//
// Los valores vienen de variables de entorno (ver .env / .env.example)
// en vez de estar hardcodeados, para poder usar distintos valores por
// entorno (preview/producción) sin tocar código, y no dejarlos fijos
// en el historial de git.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Aviso en desarrollo si falta alguna variable (evita errores confusos
// de "Firebase: Error (auth/invalid-api-key)" sin saber por qué)
if (__DEV__) {
  const faltantes = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => key);

  if (faltantes.length > 0) {
    console.warn(
      `[firebaseConfig] Faltan variables de entorno: ${faltantes.join(", ")}. ` +
        "Revisa tu archivo .env (basado en .env.example)."
    );
  }
}

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