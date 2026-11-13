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
   PERSONAL — solo lo que cambia de una persona a otra.
   La clave es el DNI. Las fechas van como "AAAA-MM-DD".
   • periodo  → se arma solo con inicio y fin.
   • fecha    → "Lima, <mes en que termina el contrato> <año>", se arma sola con `fin`.
   ============================================================ */
export const REGISTROS = {
  "45821367": {
    nombre: "YOHANA ALCIRA CHUQUIHUACCHA QUIÑONES",
    funcion: "FISCALIZADOR DE LOCAL DE VOTACIÓN",
    inicio: "2026-10-01", fin: "2026-10-05",
    codigo: "LE2-ERM2026-0143",
  },
  "70506809": {
    nombre: "CLAUDIO ALEXANDREE BEJAR LENZ",
    funcion: "FISCALIZADOR DE LOCAL DE VOTACIÓN",
    inicio: "2026-10-01", fin: "2026-10-05",
    codigo: "LE2-ERM2026-0087",
  },
  "72145896": {
    nombre: "LUCÍA FERNANDA TORRES QUISPE",
    funcion: "ASISTENTE ADMINISTRATIVO",
    inicio: "2026-09-15", fin: "2026-11-30",
    codigo: "LE2-ERM2026-0212",
  },
};

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

/* Devuelve el registro completo (datos comunes + personales + periodo y fecha calculados), o null si no existe. */
export function obtenerRegistro(dni) {
  const r = REGISTROS[dni];
  if (!r) return null;
  const f = partes(r.fin);
  return {
    ...CONFIG,
    ...r,
    periodo: r.periodo ?? armarPeriodo(r.inicio, r.fin),
    fecha: r.fecha ?? `${CONFIG.ciudad}, ${mayus(MESES[f.m - 1])} ${f.a}`,
  };
}
