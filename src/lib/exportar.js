/* Descargas: imagen (PNG), PDF y video. */
export const bajar = (blob, nombre) => {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre;
  document.body.append(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 3000);
};

export function pdfDeJpeg(jpg, w, h) {
  const enc = new TextEncoder(), parts = [], off = []; let len = 0; const add = d => { const b = typeof d === "string" ? enc.encode(d) : d; parts.push(b); len += b.length; };
  const obj = (n, body) => { off[n] = len; add(`${n} 0 obj\n`); body.forEach(add); add("\nendobj\n"); };
  add("%PDF-1.4\n"); obj(1, ["<< /Type /Catalog /Pages 2 0 R >>"]); obj(2, ["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"]);
  obj(3, ["<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>"]);
  obj(4, [`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`, jpg, "\nendstream"]);
  const cs = "q 841.89 0 0 595.28 0 0 cm /Im0 Do Q"; obj(5, [`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`]);
  const x = len; add("xref\n0 6\n0000000000 65535 f \n"); for (let n = 1; n <= 5; n++) add(String(off[n]).padStart(10, "0") + " 00000 n \n"); add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`);
  return new Blob(parts, { type: "application/pdf" });
}

/* PDF A4 horizontal con la imagen del lienzo (JPEG de alta calidad). */
export function lienzoAPdf(canvas) {
  const s = atob(canvas.toDataURL('image/jpeg', 0.95).split(',')[1]), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return pdfDeJpeg(u, canvas.width, canvas.height);
}

/* Graba la animación (canvas + audio) y descarga el video. WebM (VP9) en Chrome/Edge; MP4 en Safari. */
export async function grabarVideo({ canvas, reproducir, destAudio, nombre }) {
  if (!window.MediaRecorder || !canvas.captureStream) throw new Error('NO_SOPORTA');
  const vc = document.createElement('canvas'); vc.width = Math.round(canvas.width * 0.6); vc.height = Math.round(canvas.height * 0.6);
  const vx = vc.getContext('2d'), pistas = vc.captureStream(30).getVideoTracks();
  try { pistas[0].contentHint = 'detail'; } catch (e) { /* opcional */ }
  if (destAudio) pistas.push(...destAudio.stream.getAudioTracks());
  const tipo = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/mp4;codecs=avc1', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)) || '';
  const rec = new MediaRecorder(new MediaStream(pistas), tipo ? { mimeType: tipo, videoBitsPerSecond: 30e6 } : undefined), trozos = [];
  const fin = new Promise(res => { rec.ondataavailable = e => e.data.size && trozos.push(e.data); rec.onstop = res; });
  rec.start();
  await reproducir(() => vx.drawImage(canvas, 0, 0, vc.width, vc.height));
  await new Promise(r => setTimeout(r, 300)); rec.stop(); await fin;
  bajar(new Blob(trozos, { type: rec.mimeType }), `${nombre}.${rec.mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
}
