import { useState } from 'react';
import Brujula from './components/Brujula';
import Certificado from './components/Certificado';
import { obtenerRegistro } from './data/registros';
import { initAudio, setMuted } from './lib/audio';

const logo = `${import.meta.env.BASE_URL}img/logo-color.png`;

export default function App() {
  const [dni, setDni] = useState(''), [error, setError] = useState(''), [sel, setSel] = useState(null), [mudo, setMudo] = useState(false);

  const buscar = (valor = dni) => {
    const d = valor.trim();
    if (!/^\d{8}$/.test(d)) return setError('El DNI debe tener exactamente 8 dígitos.');
    const registro = obtenerRegistro(d);
    if (!registro) return setError('No se encontró una constancia asociada a ese DNI.');
    setError(''); initAudio(); setSel({ dni: d, registro });
  };
  const alternarSonido = () => { setMuted(!mudo); setMudo(!mudo); };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef1f6] text-slate-800">
      <Brujula />
      <button onClick={alternarSonido} aria-label="Sonido" title="Sonido" className="fixed top-4 right-4 z-20 w-11 h-11 rounded-full bg-white shadow ring-1 ring-slate-200 text-lg">{mudo ? '🔇' : '🔊'}</button>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {!sel ? (
          <section className="w-full max-w-[420px] bg-white rounded-[28px] shadow-2xl shadow-slate-400/30 overflow-hidden">
            <div className="h-4 bg-[#b01c22]" />
            <div className="mx-4 h-7 bg-[#b01c22] rounded-b-2xl" />
            <div className="px-8 pt-3 pb-8 text-center">
              <img src={logo} alt="JNE" className="h-32 mx-auto" />
              <h1 className="text-[1.7rem] font-bold text-[#b01c22] mt-1 font-sans">Consulta de Constancia</h1>
              <p className="text-lg font-bold text-slate-600 leading-snug mt-2 font-sans">Elecciones Regionales y Municipales 2026</p>

              <form className="mt-7" autoComplete="off" onSubmit={e => { e.preventDefault(); buscar(); }}>
                <input value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, ''))} inputMode="numeric" maxLength={8} placeholder="Ingresa DNI" aria-label="DNI"
                  className="w-full border border-slate-300 rounded-xl px-4 py-4 text-lg text-center text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b01c22]/50" />
                {error && <p className="text-sm text-[#b01c22] font-medium mt-3">{error}</p>}
                <button className="mt-5 bg-[#b01c22] hover:bg-[#8f151a] text-white font-bold rounded-xl px-8 py-3.5 shadow-lg shadow-red-900/25 transition font-sans">Visualizar Certificado</button>
              </form>
              <hr className="my-6 border-slate-200" />
              <p className="text-sm italic text-slate-500 leading-relaxed">"Gracias por asumir el reto como fiscalizadores de local de votación de estas Elecciones Regionales y Municipales 2026"</p>
            </div>
          </section>
        ) : (
          <Certificado dni={sel.dni} registro={sel.registro} onVolver={() => { setSel(null); setDni(''); }} />
        )}
      </main>
    </div>
  );
}
