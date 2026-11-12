# Migración al nuevo diseño de constancias (Vite + React + Tailwind)

## 1. Copiar archivos
Descarga tu proyecto de GitHub y copia el contenido de esta carpeta **encima** (respetando las rutas):

| Archivo | Acción |
|---|---|
| `index.html` | reemplazar |
| `tailwind.config.js` | reemplazar |
| `src/main.jsx`, `src/App.jsx`, `src/index.css` | reemplazar |
| `src/components/Certificado.jsx` | reemplazar (el anterior ya no sirve) |
| `src/components/Brujula.jsx` | nuevo |
| `src/data/registros.js` | nuevo: aquí van los DNI y datos de cada constancia |
| `src/lib/` (audio, dibujo, efectos, exportar, motor, recursos) | nuevo |
| `public/img/*.png, escudo.jpg` | nuevos (logos, escudo, "2026" y marca de agua) |

Puedes borrar lo que ya no se usa: `src/App.css`, `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/img/icons.*` (si no los usas).

## 2. Dependencias
No se necesita ninguna librería nueva (todo usa Canvas, Web Audio y MediaRecorder del navegador). El proyecto debe tener:
`react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss@3`, `postcss`, `autoprefixer`.

```bash
npm install
npm run dev      # probar en local
npm run build    # generar /dist
```

> Si tu `package.json` trae **Tailwind v4**, avísame: cambia `index.css` y se quitan `tailwind.config.js` y `postcss.config.js`.

## 3. GitHub Pages
Si publicas en `https://usuario.github.io/NOMBRE/`, en `vite.config.js` agrega `base: '/NOMBRE/'`. Las imágenes ya usan `import.meta.env.BASE_URL`, así que no hay que tocar nada más.

## 4. Agregar o editar constancias
Edita `src/data/registros.js`: copia un bloque, cambia el DNI (clave) y los campos
(`nombre`, `funcion`, `periodo`, `organo`, `proceso`, `cabecera`, `firmante`, `cargoFirmante`, `sede`, `fecha`, `codigo`).

## 5. Dónde cambiar cada cosa
- Diseño del certificado (posiciones, textos fijos): `src/lib/dibujo.js`
- Velocidad de escritura del nombre y duración de la celebración: `src/lib/motor.js`
- Brillo dorado, confeti y serpentinas: `src/lib/efectos.js`
- Sonidos: `src/lib/audio.js`
- Pantalla de inicio: `src/App.jsx`
