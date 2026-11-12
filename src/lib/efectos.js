/* Nombre que se escribe, brillo dorado y celebración (confeti, serpentinas y destellos). */
import { W, H, U, F } from './dibujo';

const Y = () => 26.2 * U;
function estrella(ctx, x, y, s, a) {
  const g = ctx; g.save(); g.globalAlpha = Math.max(0, Math.min(1, a)); g.translate(x, y); g.shadowColor = "rgba(255,196,40,1)"; g.shadowBlur = s * .9; g.fillStyle = "#fff8cc"; g.beginPath(); g.moveTo(0, -s);
  g.quadraticCurveTo(s * .12, -s * .12, s, 0); g.quadraticCurveTo(s * .12, s * .12, 0, s); g.quadraticCurveTo(-s * .12, s * .12, -s, 0); g.quadraticCurveTo(-s * .12, -s * .12, 0, -s); g.fill(); g.restore();
}
export function pintar(ctx, base, o, n, p, t) {
  ctx.drawImage(base, 0, 0); const y = Y(); ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.font = `700 ${o.size}px ${F.ply}`; ctx.fillStyle = "#16182b";
  for (let i = 0; i < n; i++) ctx.fillText(o.chars[i], o.x0 + o.xs[i], y);
  if (n < o.chars.length && Math.floor(t / 350) % 2 === 0) ctx.fillRect(o.x0 + (n ? o.xs[n] : 0) + .1 * U, y - o.size * .42, .12 * U, o.size * .84);
  if (p > 0 && p < 1) {                         // brillo dorado: banda inclinada, resplandor, núcleo blanco y destellos
    const b = o.tot * .2, cx = o.x0 - b * 1.3 + p * (o.tot + 2.6 * b), k = o.size * .45;
    const grad = (st) => { const gr = ctx.createLinearGradient(cx - b - k, y - o.size * .5, cx + b + k, y + o.size * .5); st.forEach(([s, c]) => gr.addColorStop(s, c)); return gr; };
    ctx.save(); ctx.shadowColor = "rgba(255,190,30,.95)"; ctx.shadowBlur = 38;
    ctx.fillStyle = grad([[0, "rgba(184,134,11,0)"], [.3, "rgba(212,160,23,.9)"], [.5, "#ffd54a"], [.7, "rgba(212,160,23,.9)"], [1, "rgba(184,134,11,0)"]]); for (let i = 0; i < n; i++) ctx.fillText(o.chars[i], o.x0 + o.xs[i], y);
    ctx.shadowBlur = 0; ctx.fillStyle = grad([[0, "rgba(255,255,255,0)"], [.43, "rgba(255,250,215,0)"], [.5, "#ffffff"], [.57, "rgba(255,250,215,0)"], [1, "rgba(255,255,255,0)"]]); for (let i = 0; i < n; i++) ctx.fillText(o.chars[i], o.x0 + o.xs[i], y);
    ctx.fillStyle = grad([[0, "rgba(212,160,23,0)"], [.5, "#f5c542"], [1, "rgba(212,160,23,0)"]]); ctx.fillRect(10 * U, 29.4 * U - .05 * U, 80 * U, .2 * U); ctx.restore();
    for (let i = 0; i < 8; i++) {
      const sd = Math.floor(t / 55) * 13 + i, r = q => { const v = Math.sin(sd * 12.9898 + q * 78.233) * 43758.5453; return v - Math.floor(v); }, x = cx + (r(1) - .5) * b * 1.9;
      if (x < o.x0 || x > o.x0 + o.tot) continue; estrella(ctx, x, y + (r(2) - .5) * o.size * 1.15, o.size * (.16 + r(3) * .42), 1 - Math.abs(x - cx) / (b * 1.1));
    }
  }
}
/* ---------- celebración final: confeti, serpentinas y destellos ---------- */
const COL = ["#b01c22", "#d4a017", "#ffd24a", "#1a2238", "#e8a0a6", "#8f8f95", "#c40000", "#f4d57a"], R = Math.random;
export function crearFx() {
  const parts = [], rib = [], st = [];
  [[.03, 1], [.97, -1]].forEach(([f, dir]) => {
    for (let i = 0; i < 75; i++) { const a = (52 + R() * 30) * Math.PI / 180, s = 1500 + R() * 1500; parts.push({ x: f * W, y: H * .99, vx: Math.cos(a) * s * dir, vy: -Math.sin(a) * s, w: 16 + R() * 16, h: 9 + R() * 9, r: R() * 6.3, vr: (R() - .5) * 16, ph: R() * 6.3, c: COL[i % COL.length], o: R() < .2, d: 0 }); }
    for (let i = 0; i < 7; i++) { const a = (48 + R() * 35) * Math.PI / 180, s = 1600 + R() * 1300; rib.push({ x: f * W, y: H * .99, vx: Math.cos(a) * s * dir, vy: -Math.sin(a) * s, c: COL[(i * 2) % COL.length], ph: R() * 6.3, pts: [] }); }
  });
  for (let i = 0; i < 90; i++) parts.push({ x: R() * W, y: -40, vx: (R() - .5) * 160, vy: 150 + R() * 250, w: 14 + R() * 14, h: 8 + R() * 8, r: R() * 6.3, vr: (R() - .5) * 10, ph: R() * 6.3, c: COL[i % COL.length], o: R() < .25, d: .6 + R() * 1.8 });
  for (let i = 0; i < 46; i++) st.push({ x: R() * W, y: R() * H * .9, s: U * (.5 + R() * 1.1), ph: R() * 6.3 });
  return { parts, rib, st, t: 0, fl: 1 };
}
export function pasoFx(fx, dt) {
  fx.t += dt; fx.fl = Math.max(0, fx.fl - dt * 2.6);
  fx.parts.forEach(p => { if (fx.t < p.d) return; p.vy = Math.min(p.vy + 2300 * dt, 620); p.vx *= 1 - 1.6 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.ph += dt * 9; });
  fx.rib.forEach(r => { r.vy = Math.min(r.vy + 2000 * dt, 520); r.vx *= 1 - 2 * dt; r.x += r.vx * dt; r.y += r.vy * dt; r.pts.push([r.x, r.y]); if (r.pts.length > 36) r.pts.shift(); });
}
export function dibujarFx(ctx, fx) {
  const g = ctx;
  if (fx.fl > 0) [0, W].forEach(x => { const gr = g.createRadialGradient(x, H, 0, x, H, H * .6); gr.addColorStop(0, `rgba(255,236,150,${.8 * fx.fl})`); gr.addColorStop(1, "rgba(255,236,150,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  g.lineCap = "round";
  fx.rib.forEach(r => { const n = r.pts.length; g.strokeStyle = r.c; for (let k = 1; k < n; k++) { g.lineWidth = 2 + 9 * k / n; g.globalAlpha = .35 + .65 * k / n; const a = r.pts[k - 1], b = r.pts[k], o1 = Math.sin(fx.t * 11 + k * .55 + r.ph) * 14 * (k - 1) / n, o2 = Math.sin(fx.t * 11 + (k + 1) * .55 + r.ph) * 14 * k / n; g.beginPath(); g.moveTo(a[0] + o1, a[1]); g.lineTo(b[0] + o2, b[1]); g.stroke(); } });
  g.globalAlpha = 1;
  fx.parts.forEach(p => { if (fx.t < p.d || p.y > H + 60) return; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(1, Math.cos(p.ph)); g.fillStyle = p.c; if (p.o) { g.beginPath(); g.arc(0, 0, p.w * .35, 0, 6.3); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); });
  const fade = Math.max(0, 1 - fx.t / 4.2); fx.st.forEach(s => estrella(ctx, s.x, s.y, s.s, Math.sin(fx.t * 6 + s.ph) * fade));
}
