import { useEffect, useRef, useState } from 'react';
import { W, H } from '../lib/dibujo';
import { cargarRecursos } from '../lib/recursos';
import { crearMotor } from '../lib/motor';
import { initAudio } from '../lib/audio';

export default function Certificado({ dni, registro, onVolver }) {
  const lienzo = useRef(null), motor = useRef(null);
  const [aviso, setAviso] = useState(''), [grabando, setGrabando] = useState(false);

  useEffect(() => {
    let vivo = true;
    initAudio();
    cargarRecursos().then(imgs => {
      if (!vivo) return;
      motor.current = crearMotor(lienzo.current, imgs);
      motor.current.cargar(registro);
      motor.current.reproducir();
    });
    return () => { vivo = false; motor.current?.parar(); };
  }, [registro]);

  const repetir = () => { initAudio(); motor.current?.reproducir(); };
  const video = async () => {
    initAudio(); setGrabando(true); setAviso('Grabando video… (unos 9 segundos)');
    try { await motor.current.video(dni); setAviso(''); }
    catch (e) { setAviso(e.message === 'NO_SOPORTA' ? 'Tu navegador no permite grabar video. Prueba con Chrome, Edge o Safari actualizado.' : 'No se pudo grabar el video.'); }
    setGrabando(false);
  };

  return (
    <section className="w-full max-w-5xl py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button onClick={onVolver} className="btn btn-gris">← Nueva consulta</button>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => motor.current?.png(dni)} className="btn btn-rojo">⬇ Imagen</button>
          <button onClick={() => motor.current?.pdf(dni)} className="btn btn-rojo">⬇ PDF</button>
          <button onClick={video} disabled={grabando} className="btn btn-rojo">⬇ Video</button>
          <button onClick={repetir} className="btn btn-gris">↻ Repetir</button>
        </div>
      </div>
      <canvas ref={lienzo} width={W} height={H} className="w-full h-auto block bg-white rounded shadow-2xl shadow-red-950/30" />
      <p className="text-center text-sm text-slate-500 mt-3 h-5">{aviso}</p>
    </section>
  );
}
