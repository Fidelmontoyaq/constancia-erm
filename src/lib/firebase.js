import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/* Pega aquí la configuración de tu app web de Firebase
   (Firebase Console → Configuración del proyecto → Tus apps → Configuración del SDK).
   Estos valores NO son secretos: la seguridad la dan las reglas de Firestore (firestore.rules). */
const firebaseConfig = {
  apiKey: 'AIzaSyAYB4On2F2SoHmlL9f2wT_6hIVnlVyH5Ak',
  authDomain: 'erm-2026.firebaseapp.com',
  projectId: 'erm-2026',
  appId: '1:575554226759:web:00fffc578a0b5bafe63f62',
};

export const db = getFirestore(initializeApp(firebaseConfig));
