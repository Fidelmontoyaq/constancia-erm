/* Consultas a Firestore: la constancia de un DNI y la imagen de la firma. */
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { completarRegistro } from '../data/registros';

/* Devuelve el registro completo (datos de Firestore + datos comunes + periodo y fecha calculados), o null si no existe. */
export async function buscarConstancia(dni) {
  const snap = await getDoc(doc(db, 'constancias', dni));
  return snap.exists() ? completarRegistro({ dni, ...snap.data() }) : null;
}

/* La firma se guarda una sola vez (config/firma) como imagen en base64. Se descarga una vez y se reutiliza. */
let firma = null;
export function cargarFirma() {
  if (!firma) {
    firma = getDoc(doc(db, 'config', 'firma'))
      .then(s => (s.exists() ? new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = s.data().dataUrl; }) : null))
      .catch(() => { firma = null; return null; });
  }
  return firma;
}
