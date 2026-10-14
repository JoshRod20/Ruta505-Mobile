import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { EQUIPADO_INICIAL } from "../constants/pinolitoCatalogo";

export function usePinolito() {
  const { user } = useAuth();
  const [logros, setLogros] = useState([]);
  const [equipadoGuardado, setEquipadoGuardado] = useState(EQUIPADO_INICIAL);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user?.uid) return undefined;
    return onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        const p = snap.data()?.pinolito ?? {};
        setLogros(p.logros ?? []);
        setEquipadoGuardado({ ...EQUIPADO_INICIAL, ...(p.equipado ?? {}) });
        setCargando(false);
      },
      () => setCargando(false)
    );
  }, [user?.uid]);

  return { uid: user?.uid, logros, equipadoGuardado, cargando };
}