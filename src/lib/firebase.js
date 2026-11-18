import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/* Pega aquí la configuración de tu app web de Firebase
   (Firebase Console → Configuración del proyecto → Tus apps → Configuración del SDK).
   Estos valores NO son secretos: la seguridad la dan las reglas de Firestore (firestore.rules). */
const firebaseConfig = {
  apiKey: 'PEGAR_AQUI',
  authDomain: 'PEGAR_AQUI',
  projectId: 'PEGAR_AQUI',
  appId: 'PEGAR_AQUI',
};

export const db = getFirestore(initializeApp(firebaseConfig));
