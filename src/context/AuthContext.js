import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { ESTADOS_VERIFICACION } from "../constants/roles";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * Calcula el estadoVerificacion "efectivo": si una suspensión temporal
 * ya venció (sancion.finaliza <= ahora), se trata como "aprobado" para
 * efectos de acceso, aunque el documento real en Firestore siga
 * diciendo "suspendido" hasta que INTUR lo revise desde el panel.
 */
const calcularEstadoEfectivo = (profileData) => {
  if (!profileData) return { estado: ESTADOS_VERIFICACION.APROBADO, sancionVigente: false };

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

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProfile();

      setUser(firebaseUser);
      setIsLoggedIn(!!firebaseUser);

      if (firebaseUser) {
        // Aún no sabemos el role/estadoVerificacion: hay que esperar
        // el primer snapshot antes de dejar que el navegador raíz decida
        // qué pantallas mostrar.
        setLoadingAuth(true);
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
          }
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
    try {
      await signOut(auth);
      // No hace falta setProfile(null) aquí: onAuthStateChanged
      // se dispara con firebaseUser null y ya lo limpia.
    } catch (err) {
      console.error("Error cerrando sesión:", err);
      throw err;
    }
  };

  const { estado: estadoVerificacion, sancionVigente } = calcularEstadoEfectivo(profile);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;