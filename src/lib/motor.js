/* Motor del certificado: dibuja, anima (nombre → brillo → celebración) y exporta. */
import { dibujarBase, geometria } from './dibujo';
import { pintar, crearFx, pasoFx, dibujarFx } from './efectos';
import { tecla, brillo, celebrar, getDest } from './audio';
import { bajar, lienzoAPdf, grabarVideo } from './exportar';

const MS = 75; // milisegundos por letra

export function crearMotor(canvas, imgs) {
  const ctx = canvas.getContext('2d');
  let base = null, geo = null, token = 0;

  const final = () => { token++; pintar(ctx, base, geo, geo.chars.length, 1, 0); };
  const cargar = r => { base = dibujarBase(imgs, r); geo = geometria(ctx, r.nombre.trim()); };

  function reproducir(espejo) {
    const id = ++token, len = geo.chars.length, tFin = len * MS + 250 + 1500, dur = tFin + 4300 + (espejo ? 700 : 0);
    let fx = null;
    return new Promise(res => {
      const t0 = performance.now(); let ultima = 0, sono = false, prev = t0;
      (function f(now) {
        if (id !== token) return res(false);
        const t = now - t0, dt = Math.min(0.05, (now - prev) / 1000), n = Math.min(len, Math.floor(t / MS));
        const tt = t - len * MS - 250, p = tt < 0 ? 0 : Math.min(1, tt / 1500); prev = now;
        if (n > ultima) { if (geo.chars[n - 1] !== ' ') tecla(); ultima = n; }
        if (p > 0 && !sono) { sono = true; brillo(); }
        if (t >= tFin && !fx) { fx = crearFx(); celebrar(); }
        pintar(ctx, base, geo, n, p, t);
        if (fx) { pasoFx(fx, dt); dibujarFx(ctx, fx); }
        if (espejo) espejo();
        if (t < dur) requestAnimationFrame(f);
        else { pintar(ctx, base, geo, len, 1, 0); if (espejo) espejo(); res(true); }
      })(t0);
    });
  }

  return {
    cargar, reproducir, final,
    parar: () => { token++; },
    png: dni => { final(); canvas.toBlob(b => bajar(b, `Constancia_${dni}.png`), 'image/png'); },
    pdf: dni => { final(); bajar(lienzoAPdf(canvas), `Constancia_${dni}.pdf`); },
    video: async dni => { try { await grabarVideo({ canvas, reproducir, destAudio: getDest(), nombre: `Constancia_${dni}` }); } finally { final(); } },
  };
}
