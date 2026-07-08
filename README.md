<div align="center">
 
```
 ██████╗ █████╗ ██████╗ ███████╗████████╗    ██████╗ ███████╗
██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝   ██╔═══██╗██╔════╝
██║     ███████║██║  ██║█████╗     ██║      ██║   ██║███████╗
██║     ██╔══██║██║  ██║██╔══╝     ██║      ██║   ██║╚════██║
╚██████╗██║  ██║██████╔╝███████╗   ██║   ██╗╚██████╔╝███████║
 ╚═════╝╚═╝  ╚═╝╚═════╝ ╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚══════╝
```

### ☢️ A fictional military OS running in the browser

[![Deploy](https://img.shields.io/github/actions/workflow/status/mausicadev/cadet.os/pages.yml?branch=main&style=flat-square&label=DEPLOY&color=00e5cc)](https://mausicadev.github.io/cadet.os/)
[![License](https://img.shields.io/badge/LICENSE-Apache_2.0-orange?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/REACT-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/VITE-8-646cff?style=flat-square&logo=vite)](https://vite.dev)

**[🔗 ENTER THE BUNKER →](https://cadetos.vercel.app/)**

</div>

---

A web-based interface mimicking a Fallout terminal. It features a mock desktop environment with movable windows, a dock, file manager, terminal, and a dashboard displaying real-time sensor data fetched from the uRadMonitor API.

Originally started with vanilla HTML and JS, it was later migrated to React to simplify window management and state. Styling is written completely from scratch in vanilla CSS.

There is no backend or server involved; everything runs entirely client-side.

---

## Getting Started

```bash
git clone https://github.com/mausicadev/cadet.os.git
cd cadet.os

npm install
npm run dev
```

Open `http://localhost:5173` and you're good to go.

---

## Features

- **Dashboard**: Features D3.js circle telemetry displaying CO2, temperature, radiation, and PM data.
- **Terminal**: Simple command-line interface supporting commands like `help`, `clear`, `status`, `reboot`, and `launch`.
- **File Manager**: Interactive virtual filesystem supporting folders, files, and text file previews.
- **Task Manager**: Interactive task lists with category filtering.
- **Notes**: Text scratchpad persisting files directly into the virtual filesystem.
- **Code Editor**: Code editor window to modify files in the file manager.
- **Metrics Graph**: Visual graphs representing real-time telemetry.
- **Settings**: Customize color presets, toggle grid mode, and configure custom sensor/weather URLs.

Windows are draggable, resizable, and minimizable, with a configurable Grid layout option.

---

## Shortcuts

| Shortcut | Description |
|:---|:---|
| `D` `D` (Double Tap) | Show Desktop (Minimize all active windows) |
| `Ctrl/⌘ + D` | Show Desktop |

---

## Tech Stack

- **React 19** — Components and state management
- **Vite 8** — Fast bundler & dev server
- **D3.js v7** — Circular dashboard rendering
- **SiriWave** — Classic iOS 9 waveform animations
- **Vanilla CSS** — Written by hand without styling frameworks
- **GitHub Pages** — Automated deploys on push to main branch

---

## License

[Apache 2.0](LICENSE)

---

Made with ☕ and questionable military aesthetics.
