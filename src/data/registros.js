/* ============================================================
   DATOS COMUNES — se escriben una sola vez y valen para todos.
   (Si una persona necesita algo distinto, agrégalo en su registro y tendrá prioridad.)
   ============================================================ */
export const CONFIG = {
  organo: "Jurado Electoral Especial de Lima Este 2",
  proceso: "Proceso de las Elecciones Regionales y Municipales 2026",
  fechasProceso: "",
  cabecera: ["ELECCIONES", "REGIONALES Y MUNICIPALES"],
  firmante: "MELINA ELIZABETH RODRIGUEZ HIDALGO",
  cargoFirmante: "Presidenta del Jurado Especial Electoral",
  sede: "LIMA ESTE 2",
  ciudad: "Lima",
};

/* ============================================================
   Las PERSONAS (DNI, nombre, función, fechas y código) ya no están aquí:
   viven en Firestore (colección "constancias") y se suben con scripts/subir-datos.mjs.
   Aquí solo queda lo común y el cálculo de periodo y fecha.
   ============================================================ */

/* ---------- utilidades (no hace falta tocarlas) ---------- */
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
const partes = iso => { const [a, m, d] = iso.split("-").map(Number); return { a, m, d }; };
const dd = n => String(n).padStart(2, "0");
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

function armarPeriodo(inicio, fin) {
  const i = partes(inicio), f = partes(fin);
  if (i.a === f.a && i.m === f.m) return `${dd(i.d)} al ${dd(f.d)} de ${MESES[f.m - 1]} del ${f.a}`;
  if (i.a === f.a) return `${dd(i.d)} de ${MESES[i.m - 1]} al ${dd(f.d)} de ${MESES[f.m - 1]} del ${f.a}`;
  return `${dd(i.d)} de ${MESES[i.m - 1]} del ${i.a} al ${dd(f.d)} de ${MESES[f.m - 1]} del ${f.a}`;
}

/* Completa el registro que llega de Firestore: datos comunes + periodo y fecha calculados a partir de inicio y fin. */
export function completarRegistro(r) {
  const f = partes(r.fin);
  return {
    ...CONFIG,
    ...r,
    periodo: r.periodo ?? armarPeriodo(r.inicio, r.fin),
    fecha: r.fecha ?? `${CONFIG.ciudad}, ${mayus(MESES[f.m - 1])} ${f.a}`,
  };
}
