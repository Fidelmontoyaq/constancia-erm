/* Carga de imágenes (public/img) y tipografías antes de dibujar. */
const BASE = import.meta.env.BASE_URL;
const ARCHIVOS = { logo: 'logo-blanco.png', anio: 'anio-2026.png', escudo: 'escudo.jpg', color: 'logo-color.png', marca: 'marca-agua.png' };
const cargar = src => new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = src; });
let cache = null;

export async function cargarRecursos() {
  if (cache) return cache;
  const claves = Object.keys(ARCHIVOS), imgs = await Promise.all(claves.map(k => cargar(`${BASE}img/${ARCHIVOS[k]}`)));
  try {
    await Promise.all(['800 40px "Cinzel"', '700 40px "Playfair Display"', '600 40px Oswald', '400 40px "Source Sans 3"', '600 40px "Source Sans 3"', '700 40px "Source Sans 3"'].map(f => document.fonts.load(f)));
  } catch (e) { /* si no hay internet se usan las tipografías de respaldo */ }
  return (cache = Object.fromEntries(claves.map((k, i) => [k, imgs[i]])));
}
