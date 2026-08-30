import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { AppState, Alert } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../services/firebase";
import { ESTADOS_VERIFICACION } from "../constants/roles";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configuración de inactividad
const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 horas
const CLAVE_ULTIMA_ACTIVIDAD = "@ruta505:ultimaActividad";

/**
 * Normaliza el estado si la sanción temporal ya venció.
 */
const calcularEstadoEfectivo = (profileData) => {
  if (!profileData)
    return { estado: ESTADOS_VERIFICACION.APROBADO, sancionVigente: false };

  if (profileData.estadoVerificacion === ESTADOS_VERIFICACION.SUSPENDIDO) {
    const finaliza = profileData.sancion?.finaliza;
    const yaVencio = finaliza && finaliza.toDate() <= new Date();
    if (yaVencio) {
      return { estado: ESTADOS_VERIFICACION.APROBADO, sancionVigente: false };
    }
    return { estado: ESTADOS_VERIFICACION.SUSPENDIDO, sancionVigente: true };
  }

  return {
    estado: profileData.estadoVerificacion ?? ESTADOS_VERIFICACION.APROBADO,
    sancionVigente: false,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Evita alertas de expiración duplicadas
  const loggingOutRef = useRef(false);

  // Listener de autenticación y perfil en Firestore
  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProfile();

      setUser(firebaseUser);
      setIsLoggedIn(!!firebaseUser);

      if (firebaseUser) {
        setLoadingAuth(true);
        loggingOutRef.current = false;

        const ref = doc(db, "users", firebaseUser.uid);
        unsubscribeProfile = onSnapshot(
          ref,
          (snap) => {
            setProfile(snap.exists() ? snap.data() : null);
            setLoadingAuth(false);
          },
          (error) => {
            console.error("Error escuchando el perfil del usuario:", error);
            setProfile(null);
            setLoadingAuth(false);
          },
        );
      } else {
        setProfile(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    await AsyncStorage.removeItem(CLAVE_ULTIMA_ACTIVIDAD);
  };

  /** Guarda el timestamp actual en AsyncStorage. */
  const registrarActividad = async () => {
    try {
      await AsyncStorage.setItem(CLAVE_ULTIMA_ACTIVIDAD, String(Date.now()));
    } catch (error) {
      console.warn("No se pudo guardar la última actividad:", error);
    }
  };

  /** Cierra sesión y muestra alerta si pasaron >24h sin uso. */
  const expirarSesionPorInactividad = async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    try {
      await logout();
      Alert.alert(
        "Sesión expirada",
        "Tu sesión se cerró porque pasaron más de 24 horas sin usar la app. Vuelve a iniciar sesión.",
      );
    } catch (error) {
      console.error("Error al cerrar sesión por inactividad:", error);
      loggingOutRef.current = false;
    }
  };

  /** Compara el timestamp guardado contra el tiempo actual. */
  const revisarExpiracionPorFecha = async () => {
    try {
      const valorGuardado = await AsyncStorage.getItem(CLAVE_ULTIMA_ACTIVIDAD);
      if (!valorGuardado) return;

      const ultimaActividad = Number(valorGuardado);
      if (Date.now() - ultimaActividad >= SESSION_TIMEOUT_MS) {
        await expirarSesionPorInactividad();
      }
    } catch (error) {
      console.warn("No se pudo revisar la última actividad:", error);
    }
  };

  // Monitoreo de inactividad (al montar y al volver a primer plano)
  useEffect(() => {
    if (!isLoggedIn) return;

    // Validación inicial al abrir/iniciar sesión
    (async () => {
      await revisarExpiracionPorFecha();
      if (!loggingOutRef.current) {
        await registrarActividad();
      }
    })();

    let appState = AppState.currentState;

    // Validación al reabrir la app desde segundo plano
    const onAppStateChange = async (nextState) => {
      if (appState.match(/inactive|background/) && nextState === "active") {
        await revisarExpiracionPorFecha();
        if (!loggingOutRef.current) {
          await registrarActividad();
        }
      }
      appState = nextState;
    };

    const sub = AppState.addEventListener("change", onAppStateChange);

    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const { estado: estadoVerificacion, sancionVigente } =
    calcularEstadoEfectivo(profile);
  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        estadoVerificacion,
        sancionVigente,
        sancion: profile?.sancion ?? null,
        isLoggedIn,
        loadingAuth,
        logout,
        touchSession: registrarActividad,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;