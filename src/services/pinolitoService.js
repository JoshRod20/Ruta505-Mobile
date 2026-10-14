import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

// Referencia al documento del usuario en Firestore.
const refUsuario = (uid) => doc(db, "users", uid);

// Guarda lo que Pinolito lleva puesto.
export async function guardarEquipado(uid, equipado) {
  await updateDoc(refUsuario(uid), {
    "pinolito.equipado": equipado,
  });
}

// Desbloquea un logro para el usuario.
// Ejemplo: desbloquearLogro(user.uid, "primer_qr").
export async function desbloquearLogro(uid, logroId) {
  await updateDoc(refUsuario(uid), {
    "pinolito.logros": arrayUnion(logroId),
  });
}