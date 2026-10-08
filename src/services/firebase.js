/**
 * firebase: componente/pantalla de la aplicación Ruta505.
 */

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Configuración de Firebase leída desde variables de entorno.
 * Mismo proyecto que la PWA (colección users, reglas y Authentication).
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** Aviso en desarrollo si faltan variables de entorno críticas. */
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

/** Instancia de la aplicación Firebase. */
const appfirebase = initializeApp(firebaseConfig);

/**
 * Auth con persistencia en AsyncStorage para conservar la sesión
 * entre cierres de la app en React Native.
 */
const auth = initializeAuth(appfirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/** Cliente de Firestore (persistencia offline nativa en React Native). */
const db = getFirestore(appfirebase);

/** Cliente de Storage para subida de fotos de experiencias. */
const storage = getStorage(appfirebase);

export { appfirebase, auth, db, storage };
