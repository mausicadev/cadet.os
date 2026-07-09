# cadet.os

This project is a small browser-based bunker operating system built around a fake desktop environment. I made it to feel like a control room: windows you can drag around, a command terminal, a file system, a telemetry dashboard, and a handful of systems that behave like they belong in a sealed-off facility.

The experience is intentionally a bit rough around the edges, but that is part of the charm. It mixes a retro terminal mood with a more modern interface, and the whole thing is designed to feel lived-in rather than polished in a corporate way.

## What it does

- Presents a desktop-style interface with draggable windows and a dock.
- Includes a terminal with a few custom commands.
- Offers a fake file manager, notes app, task list, and editor.
- Pulls in sensor telemetry and displays it on a dashboard.
- Lets you tweak theme presets, scanline intensity, and sensor URLs from settings.

## How I built it

The app started as a static web prototype and later moved to React so the window system and state management would be easier to manage. The UI is all hand-written CSS, and the telemetry visuals are built around the existing dashboard assets in the project.

## Running it locally

```bash
git clone https://github.com/mausicadev/cadet.os.git
cd cadet.os
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Commands in the terminal

The terminal supports a small set of commands:

- help
- clear
- status
- reboot
- launch
- pulse
- mission

## Notes

This is a personal project, and the style leans heavily into the idea of a bunker interface with old hardware energy. I wanted it to feel like something that was assembled by hand and then kept alive through stubbornness.
