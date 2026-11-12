import { useEffect, useRef } from 'react';

const marcas = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180, grande = i % 18 === 0, media = i % 3 === 0, s = Math.sin(a), c = Math.cos(a), r2 = grande ? 146 : media ? 156 : 163;
  return { x1: 172 * s, y1: -172 * c, x2: r2 * s, y2: -r2 * c, o: grande ? 0.55 : media ? 0.35 : 0.2, w: grande ? 2.2 : 1 };
});

/* Brújula de fondo: la aguja sigue al puntero (o a la orientación del celular) con inercia. */
export default function Brujula() {
  const svg = useRef(null), aguja = useRef(null), dial = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ang = 0, vel = 0, objetivo = 0, ultimo = -1e9, raf;
    const mover = e => {
      const r = svg.current.getBoundingClientRect();
      objetivo = (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI + 90; ultimo = performance.now();
    };
    const orientar = e => {
      const h = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
      if (h != null) { objetivo = -h; ultimo = performance.now(); }
    };
    const bucle = ahora => {
      if (ahora - ultimo > 2500) objetivo = 24 * Math.sin(ahora / 1700) + 7 * Math.sin(ahora / 470);
      vel = (vel + (((objetivo - ang + 540) % 360) - 180) * 0.03) * 0.9; ang += vel;
      aguja.current?.setAttribute('transform', `rotate(${ang.toFixed(2)})`);
      dial.current?.setAttribute('transform', `rotate(${(-ang * 0.12).toFixed(2)})`);
      raf = requestAnimationFrame(bucle);
    };
    addEventListener('pointermove', mover, { passive: true }); addEventListener('deviceorientation', orientar);
    raf = requestAnimationFrame(bucle);
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', mover); removeEventListener('deviceorientation', orientar); };
  }, []);

  return (
    <svg ref={svg} viewBox="-200 -200 400 400" aria-hidden="true" className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 'min(130vmin,980px)' }}>
      <circle r="196" fill="none" stroke="#94a3b8" strokeOpacity=".45" strokeWidth="1.4" />
      <circle r="174" fill="none" stroke="#94a3b8" strokeOpacity=".3" />
      <g ref={dial}>
        {marcas.map((m, i) => <line key={i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke="#64748b" strokeOpacity={m.o} strokeWidth={m.w} />)}
        <g fill="#64748b" fillOpacity=".6" fontFamily="Cinzel,serif" fontWeight="700" fontSize="17" textAnchor="middle">
          <text y="-132" dy=".35em" fill="#b01c22">N</text><text x="132" dy=".35em">E</text><text y="132" dy=".35em">S</text><text x="-132" dy=".35em">O</text>
        </g>
      </g>
      <g ref={aguja}>
        <polygon points="0,-158 15,0 -15,0" fill="#b01c22" fillOpacity=".38" />
        <polygon points="0,158 15,0 -15,0" fill="#94a3b8" fillOpacity=".35" />
        <circle r="9" fill="#fff" stroke="#94a3b8" />
      </g>
    </svg>
  );
}
