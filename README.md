<div align="center">

```
 ██████╗ █████╗ ██████╗ ███████╗████████╗    ██████╗ ███████╗
██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝   ██╔═══██╗██╔════╝
██║     ███████║██║  ██║█████╗     ██║      ██║   ██║███████╗
██║     ██╔══██║██║  ██║██╔══╝     ██║      ██║   ██║╚════██║
╚██████╗██║  ██║██████╔╝███████╗   ██║   ██╗╚██████╔╝███████║
 ╚═════╝╚═╝  ╚═╝╚═════╝ ╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚══════╝
```

### ☢️ un OS militar fictiv care ruleaza in browser

[![Deploy](https://img.shields.io/github/actions/workflow/status/mausicadev/cadet.os/pages.yml?branch=main&style=flat-square&label=DEPLOY&color=00e5cc)](https://mausicadev.github.io/cadet.os/)
[![License](https://img.shields.io/badge/LICENSE-Apache_2.0-orange?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/REACT-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/VITE-8-646cff?style=flat-square&logo=vite)](https://vite.dev)

**[🔗 ENTER THE BUNKER →](https://cadetos.vercel.app/)**

</div>

---

Practic am vrut sa fac ceva gen Fallout terminal dar in browser. E un desktop fake cu ferestre, dock, file manager, terminal, si un dashboard care arata date reale de la senzori (uRadMonitor API).

Am inceput cu HTML si JS vanilla, dupa am mutat totul in React ca sa fie mai usor de gestionat ferestrele si state-ul. CSS-ul e scris de mana, fara Tailwind sau alte framework-uri.

Nu e un backend, nu e un server, totul ruleaza client-side.

---

## cum pornesti

```bash
git clone https://github.com/mausicadev/cadet.os.git
cd cadet.os

npm install
npm run dev
```

Deschizi `http://localhost:5173` si gata.

---

## ce am in el

- **Dashboard** cu cercuri D3.js care arata CO2, temperatura, radiatie, PM2.5, etc
- **Terminal** simplu cu cateva comenzi (help, clear, status, reboot)
- **File Manager** cu un filesystem fake (foldere, fisiere, preview)
- **Task Manager** cu filtre si categorii
- **Notes** care se salveaza in filesystem-ul virtual
- **Editor** de text pentru fisierele din file manager
- **Metrics Graph** pentru vizualizare date
- **Settings** cu teme de culoare, grid layout, config senzori

Ferestrele se pot muta, redimensiona, minimiza. Am facut si un grid layout care le aranja automat.

---

## shortcut-uri

| Shortcut | Ce face |
|:---|:---|
| `D` `D` (dublu tap) | Show Desktop (minimizeaza tot) |
| `Ctrl/⌘ + D` | Show Desktop |

---

## tech stack

- **React 19** — componente + state
- **Vite 8** — dev server
- **D3.js v7** — cercurile alea din dashboard
- **SiriWave** — animatii de tip iOS waveform
- **CSS vanilla** — fara framework-uri, totul manual
- **GitHub Pages** — deploy automat pe push la main

---

## licenta

[Apache 2.0](LICENSE)

---

facut cu ☕ si estetica militara discutabila
</CodeContent>
<parameter name="toolAction">Rewriting README
