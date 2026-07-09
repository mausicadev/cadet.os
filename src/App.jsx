import React, { useState, useRef, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import TaskManager from './components/TaskManager';
import FileManager from './components/FileManager';
import MetricsGraph from './components/MetricsGraph';
import Editor from './components/Editor';
import Window from './components/Window';
import Dock from './components/Dock';
import Settings from './components/Settings';
import Notes from './components/Notes';
import LaunchPage from './components/LaunchPage';
import './css/os.css';
import './App.css';

// structura initiala de fisiere
const INITIAL_FILESYSTEM = {
  id: 'root',
  name: 'ROOT',
  type: 'folder',
  children: [
    {
      id: 'sys',
      name: 'sys',
      type: 'folder',
      children: [
        { id: 'core_sys', name: 'core.sys', type: 'file', size: '24 KB', mime: 'SYSTEM/BIN', content: '[HEX DUMP] 0x00FF8D 0x489E21 0x7E3A00 0xFF0011 0x90A1B2 0x38F7A1\nSYSTEM INTEGRITY: 100%\nLOAD ADDRESS: 0x00FF8000\nKERNEL HOOK: ON' },
        { id: 'radar_config', name: 'radar_config.json', type: 'file', size: '1.2 KB', mime: 'JSON', content: '{\n  "sweep_speed": 0.05,\n  "ping_decay": 0.01,\n  "grid_opacity": 0.3,\n  "auto_alarm": true,\n  "coordinates": {\n    "lat": 45.7537,\n    "lng": 21.2257\n  }\n}' },
        { id: 'diagnostics', name: 'diagnostics.sh', type: 'file', size: '800 B', mime: 'SHELL', content: '#!/bin/bash\necho "RUNNING OS DIAGNOSTICS..."\nsleep 1\necho "CHECKING MEMORY BRIDGES..."\necho "OK"\necho "CHECKING RADAR CORES..."\necho "OK"\necho "ALL SYSTEMS OPERATIVE."' },
      ]
    },
    {
      id: 'bunker',
      name: 'bunker',
      type: 'folder',
      children: [
        { id: 'temp_override', name: 'temp_override.sh', type: 'file', size: '1.5 KB', mime: 'SHELL', content: '#!/bin/bash\n# EMERGENCY OVERRIDE FOR PENTAGON TEMPS\nTARGET_TEMP=15\nCURRENT_TEMP=$(cat /sys/class/thermal/temp)\nif [ $CURRENT_TEMP -gt 25 ]; then\n  echo "WARNING: TEMPERATURE HIGH. TRIGGERING VENTILATORS."\n  /usr/bin/fan_speed_pct 100\nelse\n  echo "TEMPS CONTROLLED at ${TARGET_TEMP}C."\nfi' },
        { id: 'defense_protocol', name: 'defense_protocol.cfg', type: 'file', size: '2.5 KB', mime: 'CONFIG', content: '# BUNKER DEFENSE CONTROLS\nSECURITY_LEVEL=ALPHA\nAUTO_TURRET=ACTIVE\nRADAR_INTERCEPT=ON\nMAX_INTRUSION_THRESHOLD=0\nALARM_ROUTE=/sys/audio/alarm.wav' },
        { id: 'pc_specs', name: 'pc_build_specs.json', type: 'file', size: '1.8 KB', mime: 'JSON', content: '{\n  "motherboard": "ROG CROSSHAIR X670E HERO",\n  "cpu": "AMD Ryzen 9 7950X3D",\n  "gpu": "NVIDIA GeForce RTX 5090",\n  "ram": "64GB DDR5 G.Skill Trident Z5 6000MT/s",\n  "cooling": "Custom Hardline Water Loop",\n  "case": "Lian Li O11 Dynamic EVO XL",\n  "storage": "4TB Samsung 990 Pro NVMe SSD"\n}' }
      ]
    },
    {
      id: 'logs',
      name: 'logs',
      type: 'folder',
      children: [
        { id: 'reactor_core', name: 'reactor_core.log', type: 'file', size: '12 KB', mime: 'LOG', content: '[2026-07-06 12:00:01] CORE STATE: ACTIVE\n[2026-07-06 13:00:00] COOLANT LEVEL: 94%\n[2026-07-06 14:00:02] RADIATION FLUX: 0.56 uSv/h (NORMAL)\n[2026-07-06 15:00:00] THERMAL LOAD: 42C\n[2026-07-06 16:00:00] FUEL ROD INTEGRITY: 99.8%\n[2026-07-06 17:00:03] NO ANOMALIES DETECTED.' },
        { id: 'intruder_radar', name: 'intruder_radar.log', type: 'file', size: '3.4 KB', mime: 'LOG', content: '[2026-07-06 01:23:44] SWEEP START\n[2026-07-06 04:12:11] DISCOVERED NODE 042: DISTANCE 114m (BLIP)\n[2026-07-06 04:12:15] NODE RESOLVED: DEER (WILDLIFE)\n[2026-07-06 08:00:00] RE-CALIBRATING SWEEP SIGNAL...\n[2026-07-06 10:14:52] SECURE BEACON STRENGTH: 94%' },
        { id: 'system_boot', name: 'system_boot.log', type: 'file', size: '5.2 KB', mime: 'LOG', content: '[BOOT LOG v1.0.0]\nLOADING microcode...\nINITIALIZING kernel controllers...\nMOUNTING virtual filesystem /sys...\nLOADING graphic hardware modules...\nESTABLISHING network socket connection...\nIP ASSIGNED: 192.168.1.100\nCADET OS LOADER: COMPLETED SUCCESS.' }
      ]
    },
    {
      id: 'usr',
      name: 'usr',
      type: 'folder',
      children: [
        { id: 'notes', name: 'notes.txt', type: 'file', size: '450 B', mime: 'TEXT', content: 'TASKS TO DO IN THE BUNKER:\n1. Re-route radar sweep angles for better coverage.\n2. Fix coolant pipe valve #3 (minor drip).\n3. Install thermal override script in the main server loop.\n4. Clean the air intake filters.\n5. Post a new video updates.' },
        { id: 'devlog_draft', name: 'devlog_draft.txt', type: 'file', size: '500 B', mime: 'TEXT', content: `Finally got the live uRadMonitor API support done! The dashboard now actually updates with real CO2, VOC, Noise, and PM data. If you're running custom sensors, I also put together a customizable JSON template you can use to import whatever telemetry you want. 

Honestly, coding the custom window system from scratch and sorting out the settings page scrollbars was a massive pain, but it's finally running cleanly. Also, disabled the grid layout by default so the system starts up in a clean floating window desktop instead of stretching everything at once.` }
      ]
    }
  ]
};

const APPS = [
  { 
    id: 'terminal', 
    label: 'TERMINAL', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
    ), 
    defaultPos: { x: 80, y: 80 } 
  },
  { 
    id: 'tasks', 
    label: 'TASKS', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    ), 
    defaultPos: { x: 500, y: 80 } 
  },
  { 
    id: 'files', 
    label: 'FILES', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    ), 
    defaultPos: { x: 220, y: 220 } 
  },
  { 
    id: 'metrics', 
    label: 'METRICS', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ), 
    defaultPos: { x: 620, y: 250 } 
  },
  {
    id: 'editor',
    label: 'EDITOR',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    ),
    defaultPos: { x: 340, y: 160 }
  },
  {
    id: 'notes',
    label: 'NOTES',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    defaultPos: { x: 80, y: 500 }
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    defaultPos: { x: 620, y: 500 }
  }
];

const STORAGE_KEY = 'cadet-os-config-v1';

const getStoredConfig = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Unable to read saved app config.', error);
    return null;
  }
};

const getDefaultWindowLayouts = () => ({
  terminal: { position: { x: 80, y: 80 }, size: { width: 600, height: 400 } },
  tasks: { position: { x: 500, y: 80 }, size: { width: 550, height: 400 } },
  files: { position: { x: 220, y: 220 }, size: { width: 700, height: 420 } },
  metrics: { position: { x: 620, y: 250 }, size: { width: 600, height: 400 } },
  editor: { position: { x: 340, y: 160 }, size: { width: 550, height: 350 } },
  settings: { position: { x: 120, y: 120 }, size: { width: 650, height: 550 } },
  notes: { position: { x: 80, y: 500 }, size: { width: 600, height: 380 } }
});

function AppContent({ id, fileSystem, setFileSystem, onOpenFile, editingFile, onSaveFile, sensorData, ...props }) {
  const appComponents = {
    terminal: <Terminal {...props} />,
    tasks: <TaskManager {...props} />,
    files: (
      <FileManager
        fileSystem={fileSystem}
        setFileSystem={setFileSystem}
        onOpenFile={onOpenFile}
        {...props}
      />
    ),
    metrics: <MetricsGraph {...props} />,
    editor: (
      <Editor
        file={editingFile}
        onSaveFile={onSaveFile}
        {...props}
      />
    ),
    settings: <Settings sensorData={sensorData} {...props} />,
    notes: (
      <Notes
        fileSystem={fileSystem}
        setFileSystem={setFileSystem}
        onOpenFile={onOpenFile}
        {...props}
      />
    )
  };

  return appComponents[id] ?? null;
}

function App() {
  const saved = getStoredConfig();

  const [fileSystem, setFileSystem] = useState(INITIAL_FILESYSTEM);
  const [editingFile, setEditingFile] = useState(null);
  const [openApps, setOpenApps] = useState([]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [focusStack, setFocusStack] = useState([]);
  const [showDesktopActive, setShowDesktopActive] = useState(false);
  const [themePreset, setThemePreset] = useState(() => saved?.themePreset || 'cyan');
  const [scanlineOpacity, setScanlineOpacity] = useState(() => saved?.scanlineOpacity ?? 15);
  const [dashboardBlur, setDashboardBlur] = useState(() => saved?.dashboardBlur ?? 4);
  const [soundActive, setSoundActive] = useState(() => saved?.soundActive ?? true);
  const [sensorApiUrl, setSensorApiUrl] = useState(() => saved?.sensorApiUrl || 'https://data.uradmonitor.com/api/v1/devices');
  const [sensorHeadersText, setSensorHeadersText] = useState(() => saved?.sensorHeadersText || '{}');
  const [windowLayouts, setWindowLayouts] = useState(() => saved?.windowLayouts || getDefaultWindowLayouts());
  const [sensorData, setSensorData] = useState([]);
  const [sensorFetchStatus, setSensorFetchStatus] = useState('Waiting for URL');
  const [sensorFetchError, setSensorFetchError] = useState('');
  const [sensorRefreshIntervalSeconds, setSensorRefreshIntervalSeconds] = useState(() => saved?.sensorRefreshIntervalSeconds ?? 10);

  const [launchOverrunActive, setLaunchOverrunActive] = useState(false);
  const [ppmOverride, setPpmOverride] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/launch' || hash === '#launch') return 'launch';
    const query = window.location.search;
    if (query.includes('launch')) return 'launch';
    return 'desktop';
  });

  const [weatherApiUrl, setWeatherApiUrl] = useState(() => saved?.weatherApiUrl || 'https://api.open-meteo.com/v1/forecast?latitude=45.7537&longitude=21.2257&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto');
  const [weatherForecast, setWeatherForecast] = useState([
    { period: 'TODAY', temp: '8 °C', condition: 'SUNNY' },
    { period: 'TONIGHT', temp: '9 °C', condition: 'CLEAR' },
    { period: 'TOMORROW', temp: '12 °C', condition: 'SUNNY' },
    { period: 'MONDAY', temp: '10 °C', condition: 'CLOUDY' }
  ]);
  const [missionMessage, setMissionMessage] = useState('AIRLOCK STATUS: STEADY');
  const [beaconPulse, setBeaconPulse] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/launch' || hash === '#launch') {
        setCurrentRoute('launch');
      } else {
        setCurrentRoute('desktop');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loadWeatherData = useCallback(async () => {
    if (!weatherApiUrl) return;
    try {
      const res = await fetch(weatherApiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.daily) {
        const weatherMap = {
          0: "SUNNY", 1: "CLEAR", 2: "PARTLY CLOUDY", 3: "CLOUDY",
          45: "FOGGY", 48: "FOGGY", 51: "DRIZZLE", 53: "DRIZZLE", 55: "DRIZZLE",
          61: "RAINY", 63: "RAINY", 65: "RAINY", 71: "SNOWY", 73: "SNOWY", 75: "SNOWY",
          95: "STORM", 96: "STORM", 99: "STORM"
        };
        const daily = data.daily;
        const forecast = [];
        const getDayName = (dateStr) => {
          const d = new Date(dateStr);
          return d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
        };

        const todayMax = Math.round(daily.temperature_2m_max[0]);
        const todayCode = daily.weather_code[0];
        forecast.push({ period: "TODAY", temp: `${todayMax} °C`, condition: weatherMap[todayCode] || "CLEAR" });

        const tonightMin = Math.round(daily.temperature_2m_min[0]);
        const tonightCode = daily.weather_code[0];
        forecast.push({ period: "TONIGHT", temp: `${tonightMin} °C`, condition: tonightCode === 0 ? "CLEAR" : (weatherMap[tonightCode] || "CLEAR") });

        const tomorrowMax = Math.round(daily.temperature_2m_max[1]);
        const tomorrowCode = daily.weather_code[1];
        forecast.push({ period: "TOMORROW", temp: `${tomorrowMax} °C`, condition: weatherMap[tomorrowCode] || "CLEAR" });

        const day2Name = getDayName(daily.time[2]);
        const day2Max = Math.round(daily.temperature_2m_max[2]);
        const day2Code = daily.weather_code[2];
        forecast.push({ period: day2Name, temp: `${day2Max} °C`, condition: weatherMap[day2Code] || "CLEAR" });

        setWeatherForecast(forecast);
      }
    } catch (e) {
      console.warn("Weather error:", e);
    }
  }, [weatherApiUrl]);

  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 60000);
    return () => clearInterval(interval);
  }, [loadWeatherData]);

  const triggerLaunchSequence = () => {
    setLaunchOverrunActive(true);
    if (window.addOrangeBackgroundToContainer) {
      window.addOrangeBackgroundToContainer();
    }
    setOpenApps([]);
    setFocusStack([]);
    setMinimizedApps([]);

    let startVal = (sensorData && sensorData[0]) ? Number(sensorData[0].last_co2) || 450 : 450;
    let currentVal = startVal;
    const interval = setInterval(() => {
      currentVal += Math.ceil((9999 - startVal) / 25);
      if (currentVal >= 9999) {
        currentVal = 9999;
        clearInterval(interval);
        setTimeout(() => {
          setLaunchOverrunActive(false);
          setPpmOverride(null);
          window.location.hash = '#/launch';
        }, 2500);
      }
      setPpmOverride(currentVal);
    }, 45);
  };

  const handleReturnFromLaunch = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(5, 12, 14, 0.96)';
    overlay.style.color = 'rgb(252, 104, 6)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.fontFamily = 'Courier New, Courier, monospace';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.border = '4px solid rgb(252, 104, 6)';
    overlay.style.boxSizing = 'border-box';
    overlay.style.textShadow = '0 0 10px rgba(252, 104, 6, 0.8)';
    
    overlay.innerHTML = `
      <div style="text-align: center; max-width: 600px; padding: 20px; border: 2px dashed rgb(252, 104, 6);">
        <h1 style="font-size: 2.2rem; margin-bottom: 20px; letter-spacing: 3px;">☣ SYSTEM REBOOT ☣</h1>
        <p style="font-size: 1.2rem; margin-bottom: 25px; line-height: 1.6; letter-spacing: 1px;">
          LAUNCH COMPLETED. SHIELD STATUS NOMINAL.<br/>
          RE-ESTABLISHING SECURE OS ENVIRONMENT.<br/>
          SYNCHRONIZING TELEMETRY STACKS.
        </p>
        <div style="font-size: 1rem; color: #68fff0; text-shadow: 0 0 8px rgba(104, 255, 240, 0.6);">
          RESTORE SEQUENCE RE-LOADING IN 1.5s...
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => {
      window.location.hash = '#';
      window.location.reload();
    }, 1500);
  };

  useEffect(() => {
    const root = document.documentElement;
    let primary = '#68fff0';
    let secondary = 'rgb(252, 104, 6)';
    let glow = 'rgba(104, 255, 240, 0.4)';
    let border = 'rgba(104, 255, 240, 0.3)';
    let bg = 'rgba(104, 255, 240, 0.15)';
    
    if (themePreset === 'orange') {
      primary = 'rgb(252, 104, 6)';
      secondary = '#68fff0';
      glow = 'rgba(252, 104, 6, 0.4)';
      border = 'rgba(252, 104, 6, 0.3)';
      bg = 'rgba(252, 104, 6, 0.15)';
    } else if (themePreset === 'green') {
      primary = '#39ff14';
      secondary = '#ff073a';
      glow = 'rgba(57, 255, 20, 0.4)';
      border = 'rgba(57, 255, 20, 0.3)';
      bg = 'rgba(57, 255, 20, 0.15)';
    } else if (themePreset === 'red') {
      primary = '#ff073a';
      secondary = '#68fff0';
      glow = 'rgba(255, 7, 58, 0.4)';
      border = 'rgba(255, 7, 58, 0.3)';
      bg = 'rgba(255, 7, 58, 0.15)';
    }
    
    root.style.setProperty('--theme-primary', primary);
    root.style.setProperty('--theme-secondary', secondary);
    root.style.setProperty('--theme-glow', glow);
    root.style.setProperty('--theme-border', border);
    root.style.setProperty('--theme-primary-bg', bg);
  }, [themePreset]);

  // salvam config-ul in localStorage de fiecare data cand se schimba ceva
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cfg = {
      themePreset,
      scanlineOpacity,
      dashboardBlur,
      soundActive,
      sensorApiUrl,
      sensorHeadersText,
      sensorRefreshIntervalSeconds,
      windowLayouts,
      weatherApiUrl
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }, [themePreset, scanlineOpacity, dashboardBlur, soundActive, sensorApiUrl, sensorHeadersText, windowLayouts, weatherApiUrl]);

  const loadSensorData = useCallback(async () => {
    if (!sensorApiUrl) {
      setSensorData([]);
      setSensorFetchStatus('Ready');
      setSensorFetchError('');
      return;
    }

    try {
      setSensorFetchError('');

      let headers = {};
      try {
        const parsed = JSON.parse(sensorHeadersText || '{}');
        if (parsed && typeof parsed === 'object') {
          headers = parsed;
        }
      } catch {
        headers = {};
      }

      const fetchOptions = {
        method: 'GET',
        headers: Object.keys(headers).length > 0 ? headers : undefined
      };

      const response = await fetch(sensorApiUrl, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.devices)
            ? payload.devices
            : Array.isArray(payload?.records)
              ? payload.records
              : Array.isArray(payload?.result)
                ? payload.result
                : Array.isArray(payload?.record)
                  ? payload.record
                  : Array.isArray(payload?.data?.devices)
                    ? payload.data.devices
                    : (payload && typeof payload === 'object' && (payload.last_temperature !== undefined || payload.last_co2 !== undefined || payload.id !== undefined))
                      ? [payload]
                      : [];

      if (Array.isArray(normalized) && normalized.length > 0) {
        setSensorData(normalized);
        setSensorFetchStatus(`Loaded ${normalized.length} device${normalized.length === 1 ? '' : 's'}`);
        setSensorFetchError('');
      } else if (Array.isArray(normalized)) {
        setSensorData([]);
        setSensorFetchStatus('Loaded 0 devices');
        setSensorFetchError('No sensor data available');
      } else {
        throw new Error('Response is not an array or expected structure');
      }
    } catch (error) {
      setSensorData([]);
      setSensorFetchStatus('Ready');
      setSensorFetchError(error?.message || 'Unable to fetch');
    }
  }, [sensorApiUrl, sensorHeadersText]);

  useEffect(() => {
    if (!sensorApiUrl) {
      setSensorData([]);
      setSensorFetchStatus('Ready');
      setSensorFetchError('');
      return;
    }

    let cancelled = false;
    const intervalMs = Math.max(5000, sensorRefreshIntervalSeconds * 1000);

    const poll = async () => {
      if (cancelled) return;
      await loadSensorData();
    };

    loadSensorData();
    const intervalId = setInterval(poll, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [sensorApiUrl, loadSensorData, sensorRefreshIntervalSeconds]);

  const activeAppId = focusStack.length > 0 ? focusStack[focusStack.length - 1] : null;

  const openApp = (appId) => {
    if (!openApps.includes(appId)) {
      setOpenApps(prev => [...prev, appId]);
      setFocusStack(prev => [...prev, appId]);
    } else {
      // daca e deja deschis, doar il aducem in fata
      if (minimizedApps.includes(appId)) {
        setMinimizedApps(prev => prev.filter(id => id !== appId));
      }
      setFocusStack(prev => [...prev.filter(id => id !== appId), appId]);
    }
  };

  const closeApp = (appId) => {
    // scoatem din lista de deschise
    setOpenApps(prev => prev.filter(id => id !== appId));
    setFocusStack(prev => prev.filter(id => id !== appId));
    setMinimizedApps(prev => prev.filter(id => id !== appId));
    if (appId === 'editor') {
      setEditingFile(null);
    }
  };

  const minimizeApp = (appId) => {
    if (!minimizedApps.includes(appId)) {
      setMinimizedApps(prev => [...prev, appId]);
    }
    
    // dam focus la urmatoarea fereastra
    const remaining = focusStack.filter(id => id !== appId && !minimizedApps.includes(id));
    if (remaining.length > 0) {
      const nextActive = remaining[remaining.length - 1];
      setFocusStack(prev => [...prev.filter(id => id !== nextActive), nextActive]);
    }
  };

  const focusApp = (appId) => {
    if (minimizedApps.includes(appId)) {
      setMinimizedApps(prev => prev.filter(id => id !== appId));
    }
    setFocusStack(prev => [...prev.filter(id => id !== appId), appId]);
  };

  const restoreApp = (appId) => {
    setMinimizedApps(prev => {
      const updated = prev.filter(id => id !== appId);
      if (updated.length === 0) {
        setShowDesktopActive(false);
      }
      return updated;
    });
    setFocusStack(prev => [...prev.filter(id => id !== appId), appId]);
  };

  const toggleApp = (appId) => {
    if (!openApps.includes(appId)) {
      openApp(appId);
    } else {
      const isMinimized = minimizedApps.includes(appId);
      const isActive = activeAppId === appId;

      if (isMinimized) {
        restoreApp(appId);
      } else if (!isActive) {
        focusApp(appId);
      } else {
        minimizeApp(appId);
      }
    }
  };

  const toggleShowDesktop = () => {
    setMinimizedApps(prevMinimized => {
      
      const allOpenMinimized = openApps.every(id => prevMinimized.includes(id));
      if (allOpenMinimized && openApps.length > 0) {
        setShowDesktopActive(false);
        return [];
      } else {
        setShowDesktopActive(true);
        return [...openApps];
      }
    });
  };

  const openInEditor = (file) => {
    setEditingFile(file);
    openApp('editor');
  };

  const saveFile = (fileId, newContent) => {
    const updateNode = (node) => {
      if (node.id === fileId) {
        return { ...node, content: newContent, size: `${newContent.length} B` };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    // TODO: poate ar trebui sa salvez si pozitiile la unload
    setFileSystem(prev => updateNode(prev));
    
    setEditingFile(prev => prev && prev.id === fileId ? { ...prev, content: newContent, size: `${newContent.length} B` } : prev);
  };

  // reboot cu overlay - un pic dramatic dar arata misto
  const reboot = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(5, 12, 14, 0.96)';
    overlay.style.color = 'rgb(252, 104, 6)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.fontFamily = 'Courier New, Courier, monospace';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.border = '4px solid rgb(252, 104, 6)';
    overlay.style.boxSizing = 'border-box';
    overlay.style.textShadow = '0 0 10px rgba(252, 104, 6, 0.8)';
    
    overlay.innerHTML = `
      <div style="text-align: center; max-width: 600px; padding: 20px; border: 2px dashed rgb(252, 104, 6);">
        <h1 style="font-size: 2.2rem; margin-bottom: 20px; letter-spacing: 3px;">☣ EMERGENCY OVERRIDE ☣</h1>
        <p style="font-size: 1.2rem; margin-bottom: 25px; line-height: 1.6; letter-spacing: 1px;">
          REBOOTING WEBOSE CORE CHANNELS...<br/>
          CLEARING RAM BRIDGES & ENCRYPTED STACKS.<br/>
          ESTABLISHING SECURE RE-ROUTE SEQUENCE.
        </p>
        <div style="font-size: 1rem; color: #68fff0; text-shadow: 0 0 8px rgba(104, 255, 240, 0.6);">
          SYSTEM BOOT SEQUENCE RE-LOADING IN 1.5s...
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // double-tap D pt show desktop
  const lastDPress = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        const target = e.target;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInput) {
          const now = Date.now();
          if (now - lastDPress.current < 300) {
            toggleShowDesktop();
            lastDPress.current = 0; 
          } else {
            lastDPress.current = now;
          }
        }
      }

      // ctrl+D alternativa
      if ((e.key === 'd' || e.key === 'D') && (e.ctrlKey || e.metaKey)) {
        const target = e.target;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInput) {
          e.preventDefault(); 
          toggleShowDesktop();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openApps, minimizedApps, showDesktopActive]);

  // verificam daca e vreo fereastra vizibila
  const anyVisible = openApps.some(id => !minimizedApps.includes(id));

  // stilul pt efectul CRT
  const crtStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
    backgroundSize: '100% 4px, 6px 100%',
    opacity: scanlineOpacity / 100,
    zIndex: 9999,
    pointerEvents: 'none'
  };

  if (currentRoute === 'launch') {
    return <LaunchPage onReturn={handleReturnFromLaunch} />;
  }

  return (
    <div className="os-wrapper">
      {/* background cu dashboard-ul */}
      <div 
        className={`os-background ${anyVisible ? 'blurred' : ''}`}
        style={anyVisible ? { filter: `blur(${dashboardBlur}px) brightness(0.85)` } : {}}
      >
        <Dashboard 
          sensorData={sensorData} 
          launchOverrunActive={launchOverrunActive} 
          weatherForecast={weatherForecast} 
          ppmOverride={ppmOverride}
        />
      </div>

      {/* efect scanline CRT */}
      <div style={crtStyle} />

      <div className="os-overlays">
          {APPS.filter(app => app.id !== 'settings').map(app => {
            const isOpen = openApps.includes(app.id);
            if (!isOpen) return null;

            const isFocused = activeAppId === app.id;
            const isMinimized = minimizedApps.includes(app.id);
            const zIndex = 100 + focusStack.indexOf(app.id);

            return (
              <Window
                key={app.id}
                id={app.id}
                title={app.label}
                onClose={() => closeApp(app.id)}
                defaultPos={app.defaultPos}
                position={windowLayouts[app.id]?.position}
                size={windowLayouts[app.id]?.size}
                onLayoutChange={(layout) => setWindowLayouts(prev => ({ ...prev, [app.id]: { ...prev[app.id], ...layout } }))}
                focused={isFocused}
                zIndex={zIndex}
                slidOut={isMinimized}
                onFocus={() => focusApp(app.id)}
                onRestore={() => restoreApp(app.id)}
              >
                <AppContent 
                  id={app.id} 
                  fileSystem={fileSystem}
                  setFileSystem={setFileSystem}
                  onOpenFile={openInEditor}
                  editingFile={editingFile}
                  onSaveFile={saveFile}
                  onClose={() => closeApp(app.id)}
                  themePreset={themePreset}
                  setThemePreset={setThemePreset}
                  scanlineOpacity={scanlineOpacity}
                  setScanlineOpacity={setScanlineOpacity}
                  dashboardBlur={dashboardBlur}
                  setDashboardBlur={setDashboardBlur}
                  soundActive={soundActive}
                  setSoundActive={setSoundActive}
                  sensorApiUrl={sensorApiUrl}
                  setSensorApiUrl={setSensorApiUrl}
                  sensorHeadersText={sensorHeadersText}
                  setSensorHeadersText={setSensorHeadersText}
                  sensorRefreshIntervalSeconds={sensorRefreshIntervalSeconds}
                  setSensorRefreshIntervalSeconds={setSensorRefreshIntervalSeconds}
                  windowLayouts={windowLayouts}
                  setWindowLayouts={setWindowLayouts}
                  sensorData={sensorData}
                  setSensorData={setSensorData}
                  sensorFetchStatus={sensorFetchStatus}
                  sensorFetchError={sensorFetchError}
                  fetchSensorData={loadSensorData}
                  onTriggerLaunch={triggerLaunchSequence}
                  weatherApiUrl={weatherApiUrl}
                  setWeatherApiUrl={setWeatherApiUrl}
                />
              </Window>
            );
          })}
        </div>

      {/* settings-ul e mereu deasupra */}
      {openApps.includes('settings') && !minimizedApps.includes('settings') && (
        <Window
          key="settings"
          id="settings"
          title="SETTINGS"
          onClose={() => closeApp('settings')}
          defaultPos={{ x: 120, y: 120 }}
          position={windowLayouts.settings?.position}
          size={windowLayouts.settings?.size}
          onLayoutChange={(layout) => setWindowLayouts(prev => ({ ...prev, settings: { ...prev.settings, ...layout } }))}
          focused={activeAppId === 'settings'}
          zIndex={500}
          slidOut={false}
          onFocus={() => focusApp('settings')}
          onRestore={() => restoreApp('settings')}
        >
          <AppContent 
            id="settings" 
            fileSystem={fileSystem}
            setFileSystem={setFileSystem}
            onOpenFile={openInEditor}
            editingFile={editingFile}
            onSaveFile={saveFile}
            onClose={() => closeApp('settings')}
            themePreset={themePreset}
            setThemePreset={setThemePreset}
            scanlineOpacity={scanlineOpacity}
            setScanlineOpacity={setScanlineOpacity}
            dashboardBlur={dashboardBlur}
            setDashboardBlur={setDashboardBlur}
            soundActive={soundActive}
            setSoundActive={setSoundActive}
            sensorApiUrl={sensorApiUrl}
            setSensorApiUrl={setSensorApiUrl}
            sensorHeadersText={sensorHeadersText}
            setSensorHeadersText={setSensorHeadersText}
            sensorRefreshIntervalSeconds={sensorRefreshIntervalSeconds}
            setSensorRefreshIntervalSeconds={setSensorRefreshIntervalSeconds}
            windowLayouts={windowLayouts}
            setWindowLayouts={setWindowLayouts}
            sensorData={sensorData}
            setSensorData={setSensorData}
            sensorFetchStatus={sensorFetchStatus}
            sensorFetchError={sensorFetchError}
            fetchSensorData={loadSensorData}
            onTriggerLaunch={triggerLaunchSequence}
            weatherApiUrl={weatherApiUrl}
            setWeatherApiUrl={setWeatherApiUrl}
          />
        </Window>
      )}

      {/* dock-ul jos */}
      <Dock
        apps={APPS}
        openApps={openApps}
        activeAppId={activeAppId}
        minimizedApps={minimizedApps}
        onToggleApp={toggleApp}
        onToggleShowDesktop={toggleShowDesktop}
        showDesktopActive={showDesktopActive}
        onReboot={reboot}
      />
    </div>
  );
}

export default App;
