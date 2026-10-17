/**
 * usePassport: progreso del pasaporte del perfil actual (en tiempo real desde Firestore).
 * Al cambiar de usuario se vacía y se vuelve a cargar el pasaporte del nuevo uid.
 */

import { useCallback, useEffect, useState } from "react";

import { INSIGNIAS, NIVELES } from "../constants/passportCatalog";
import {
  claimFromQr,
  EMPTY_PASSPORT,
  subscribePassport,
} from "../services/passportService";

export default function usePassport(uid) {
  const [state, setState] = useState(EMPTY_PASSPORT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setState(EMPTY_PASSPORT);
    setLoading(true);
    return subscribePassport(
      uid,
      (next) => {
        setState(next);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [uid]);

  // El snapshot se actualiza solo después de escribir; no hace falta setState aquí.
  const claim = useCallback((data) => claimFromQr(uid, data), [uid]);

  // Las desbloqueadas van primero, en el orden en que se obtuvieron.
  const withState = (catalog, ids) =>
    catalog
      .map((item) => ({ ...item, unlocked: ids.includes(item.id) }))
      .sort(
        (a, b) =>
          Number(b.unlocked) - Number(a.unlocked) ||
          ids.indexOf(a.id) - ids.indexOf(b.id),
      );

  return {
    loading,
    rutas: state.lugares.length,
    totalInsignias: state.insignias.length,
    insignias: withState(INSIGNIAS, state.insignias),
    niveles: withState(NIVELES, state.niveles),
    claim,
  };
}
