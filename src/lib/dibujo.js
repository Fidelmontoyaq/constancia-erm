/* Dibujo del certificado en un lienzo A4 horizontal. U = 1 % del ancho (equivale a 1cqw del diseño). */
export const W = 2376, H = 1680, U = W / 100;
export const F = { serif: '"Cinzel","Times New Roman",serif', ply: '"Playfair Display",Georgia,serif', sans: '"Source Sans 3","Segoe UI",sans-serif', osw: 'Oswald,"Arial Narrow",sans-serif' };

const sp = (g, v) => { if ("letterSpacing" in g) g.letterSpacing = v + "px"; };
function palabras(segs) {                      // [{t,b}] -> palabras con piezas (negrita / normal)
  const out = []; let cur = [];
  segs.forEach(s => { let buf = ""; for (const ch of s.t) { if (ch === " ") { if (buf) cur.push({ t: buf, b: s.b }); buf = ""; if (cur.length) { out.push(cur); cur = []; } } else buf += ch; } if (buf) cur.push({ t: buf, b: s.b }); });
  if (cur.length) out.push(cur); return out;
}
function parrafo(g, segs, x, y, w, size, lh, justificar) {
  const fnt = b => `${b ? 700 : 400} ${size}px ${F.sans}`, ws = palabras(segs).map(p => ({ p, w: p.reduce((a, q) => (g.font = fnt(q.b), a + g.measureText(q.t).width), 0) }));
  g.font = fnt(0); const esp = g.measureText(" ").width, lineas = []; let L = [], lw = 0;
  ws.forEach(o => { if (L.length && lw + esp + o.w > w) { lineas.push({ L, lw }); L = []; lw = 0; } lw += (L.length ? esp : 0) + o.w; L.push(o); }); lineas.push({ L, lw, ult: true });
  lineas.forEach((ln, i) => { const gap = justificar && !ln.ult && ln.L.length > 1 ? (w - ln.L.reduce((a, o) => a + o.w, 0)) / (ln.L.length - 1) : esp; let cx = x; ln.L.forEach(o => { o.p.forEach(q => { g.font = fnt(q.b); g.fillText(q.t, cx, y + lh * (i + .5)); cx += g.measureText(q.t).width; }); cx += gap; }); });
  return y + lh * lineas.length;
}
export function dibujarBase(imgs, r) {
  const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
  const mk = imgs.marca; let w = 42 * U, h = w * mk.height / mk.width; g.drawImage(mk, 50 * U - w / 2, .53 * H - h / 2, w, h);
  { const ch = [..."JURADO NACIONAL DE ELECCIONES"], sz = 1.35 * U, tw = w * 156 / 169, ty = .53 * H - h / 2 + h * 147 / 157;   // texto del logo redibujado en vector: nítido
    g.font = `700 ${sz}px ${F.sans}`; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = "rgba(122,131,148,.36)";
    const ws = ch.map(c => g.measureText(c).width), gap = (tw - ws.reduce((x, y) => x + y, 0)) / (ch.length - 1); let tx = 50 * U - tw / 2; ch.forEach((c, i) => { g.fillText(c, tx, ty); tx += ws[i] + gap; }); }
  const banda = (y, hh) => { const gr = g.createLinearGradient(0, y, 0, y + hh); gr.addColorStop(0, "#c40000"); gr.addColorStop(.6, "#a00000"); gr.addColorStop(1, "#8c0000"); g.fillStyle = gr; g.fillRect(0, y, W, hh); };
  banda(0, 8.6 * U); banda(H - 3.2 * U, 3.2 * U);
  const im = (i, x, y, hh, der) => { const ww = hh * i.width / i.height; g.drawImage(i, der ? W - x - ww : x, y, ww, hh); };
  im(imgs.logo, 3.2 * U, .9 * U, 6.8 * U); im(imgs.anio, 3.6 * U, 1.45 * U, 5.7 * U, true);
  g.textBaseline = "middle"; g.textAlign = "center"; g.fillStyle = "#fff"; g.font = `600 ${2.05 * U}px ${F.osw}`; sp(g, .16 * U);
  r.cabecera.forEach((s, i) => g.fillText(s.toUpperCase(), 50 * U, (4.3 + (i - .5) * 2.45) * U));
  g.fillStyle = "#8f8f95"; const bot = H / U;
  [[1.2, 14, 5.2], [3.4, 15.5, 6.8]].forEach(([x, t, b]) => { g.fillRect(x * U, t * U, .12 * U, (bot - t - b) * U); g.fillRect(W - (x + .12) * U, t * U, .12 * U, (bot - t - b) * U); });
  g.fillStyle = "#b00000"; g.font = `800 ${2.7 * U}px ${F.serif}`; sp(g, .04 * U); g.fillText("CONSTANCIA DE PRESTACIÓN DE SERVICIOS", 50 * U, 13.7 * U);
  g.fillStyle = "#333"; g.font = `400 ${1.45 * U}px ${F.sans}`; sp(g, 0); g.fillText(`La Presidenta del ${r.organo}, otorga la Constancia a:`, 50 * U, 16.8 * U);
  const rg = g.createLinearGradient(45.5 * U, 0, 54.5 * U, 0); rg.addColorStop(0, "rgba(176,0,0,0)"); rg.addColorStop(.5, "#b00000"); rg.addColorStop(1, "rgba(176,0,0,0)"); g.fillStyle = rg; g.fillRect(45.5 * U, 18.5 * U, 9 * U, .22 * U);
  g.globalCompositeOperation = "multiply"; im(imgs.escudo, 6.4 * U, 11.4 * U, 6.2 * U * imgs.escudo.height / imgs.escudo.width, true); g.globalCompositeOperation = "source-over";
  g.fillStyle = "#5a5a63"; g.fillRect(10 * U, 29.4 * U, 80 * U, .07 * U);
  g.textAlign = "left"; g.fillStyle = "#222"; const lh = 1.95 * U * 1.6;
  const y2 = parrafo(g, [{ t: "Por su participación e identificación con el Jurado Nacional de Elecciones, por haber prestado servicios de " }, { t: r.funcion, b: 1 }, { t: " del " }, { t: r.periodo, b: 1 }, { t: ", asignado al " + r.organo + ", durante el " }, { t: r.proceso, b: 1 }, { t: (r.fechasProceso || "") + "." }], 10.5 * U, 31.4 * U, 79 * U, 1.95 * U, lh, true);
  parrafo(g, [{ t: "Se expide el presente documento para los fines que el interesado considere convenientes." }], 10.5 * U, y2 + 1.6 * U, 79 * U, 1.95 * U, lh, false);
  g.textAlign = "right"; g.font = `700 ${1.5 * U}px ${F.sans}`; g.fillStyle = "#222"; g.fillText(r.fecha, W - 5.6 * U, 60.2 * U);
  w = 6.4 * U * imgs.color.width / imgs.color.height; g.globalCompositeOperation = "multiply"; g.drawImage(imgs.color, 27.5 * U, 57.6 * U, w, 6.4 * U); g.globalCompositeOperation = "source-over";
  g.fillStyle = "#2b2b30"; g.fillRect(35.5 * U, 58.7 * U, 34 * U, .14 * U);
  g.textAlign = "center"; g.fillStyle = "#222"; g.font = `700 ${1.2 * U}px ${F.sans}`; g.fillText(r.firmante.toUpperCase(), 52.5 * U, 60.1 * U);
  g.font = `600 ${1.2 * U}px ${F.sans}`; g.fillText(r.cargoFirmante, 52.5 * U, 61.6 * U); g.font = `400 ${1.2 * U}px ${F.sans}`; g.fillText(r.sede, 52.5 * U, 63.1 * U);
  g.fillStyle = "#fff"; g.font = `400 ${1 * U}px ${F.sans}`; sp(g, .12 * U); g.fillText(`CONSTANCIA N.° ${r.codigo}`, 50 * U, H - 1.6 * U); sp(g, 0);
  g.strokeStyle = "#fff"; g.lineWidth = 2.4; g.beginPath(); g.moveTo(0, H - 4.3 * U); g.lineTo(9 * U, H - 2.5 * U); g.stroke();
  return c;
}
export function geometria(ctx, nombre) {                    // posiciones de cada letra (para escribir letra por letra)
  let size = 3.3 * U; const med = s => { ctx.font = `700 ${s}px ${F.ply}`; return [...nombre].map(ch => ctx.measureText(ch).width + .035 * s); };
  let a = med(size), tot = a.reduce((x, y) => x + y, 0); if (tot > 80 * U) { size *= 80 * U / tot; a = med(size); tot = a.reduce((x, y) => x + y, 0); }
  let x = 0; return { size, chars: [...nombre], xs: a.map(v => (x += v) - v), tot, x0: (W - tot) / 2 };
}
