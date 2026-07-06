import React, { useState, useRef, useEffect } from 'react';
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
import Radar from './components/Radar';
import './css/os.css';

// Initial filesystem structures
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
        { id: 'notes', name: 'notes.txt', type: 'file', size: '450 B', mime: 'TEXT', content: 'TASKS TO DO IN THE BUNKER:\n1. Re-route radar sweep angles for better coverage.\n2. Fix coolant pipe valve #3 (minor drip).\n3. Install thermal override script in the main server loop.\n4. Clean the air intake filters.\n5. Post a new video updates.' }
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

function AppContent({ id, fileSystem, setFileSystem, onOpenFile, editingFile, onSaveFile, ...props }) {
  switch (id) {
    case 'terminal': return <Terminal {...props} />;
    case 'tasks': return <TaskManager {...props} />;
    case 'files': 
      return (
        <FileManager 
          fileSystem={fileSystem} 
          setFileSystem={setFileSystem} 
          onOpenFile={onOpenFile} 
          {...props} 
        />
      );
    case 'metrics': return <MetricsGraph {...props} />;
    case 'editor': 
      return (
        <Editor 
          file={editingFile} 
          onSaveFile={onSaveFile} 
          {...props} 
        />
      );
    case 'settings':
      return (
        <Settings 
          {...props}
        />
      );
    case 'notes':
      return (
        <Notes 
          fileSystem={fileSystem} 
          setFileSystem={setFileSystem} 
          onOpenFile={onOpenFile} 
          {...props} 
        />
      );
    default: return null;
  }
}

function App() {
  // Lifted filesystem state
  const [fileSystem, setFileSystem] = useState(INITIAL_FILESYSTEM);
  const [editingFile, setEditingFile] = useState(null);

  // On startup: 6 grid windows should be showed in grid (Settings closed, Radar removed)
  const [openApps, setOpenApps] = useState([
    'terminal', 'files', 'tasks', 'notes', 'metrics', 'editor'
  ]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [focusStack, setFocusStack] = useState([
    'terminal', 'files', 'tasks', 'notes', 'metrics', 'editor'
  ]);
  const [showDesktopActive, setShowDesktopActive] = useState(false);

  // Default Grid Placements (4x2 screen grid coordinates)
  // Left half: Columns 1-2. Right half: Columns 3-4.
  const [gridPlacements, setGridPlacements] = useState({
    files: { row: 1, col: 1, colspan: 2, rowspan: 1 },
    editor: { row: 2, col: 1, colspan: 2, rowspan: 1 },
    terminal: { row: 1, col: 3, colspan: 1, rowspan: 1 },
    metrics: { row: 1, col: 4, colspan: 1, rowspan: 1 },
    tasks: { row: 2, col: 3, colspan: 1, rowspan: 1 },
    notes: { row: 2, col: 4, colspan: 1, rowspan: 1 }
  });

  // Settings State
  const [gridLayoutActive, setGridLayoutActive] = useState(true);
  const [themePreset, setThemePreset] = useState('cyan');
  const [scanlineOpacity, setScanlineOpacity] = useState(15);
  const [dashboardBlur, setDashboardBlur] = useState(4);
  const [soundActive, setSoundActive] = useState(true);

  // Dynamically apply theme variables to the document root
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

  const activeAppId = focusStack.length > 0 ? focusStack[focusStack.length - 1] : null;

  const openApp = (appId) => {
    if (!openApps.includes(appId)) {
      setOpenApps(prev => [...prev, appId]);
      setFocusStack(prev => [...prev, appId]);
    } else {
      if (minimizedApps.includes(appId)) {
        setMinimizedApps(prev => prev.filter(id => id !== appId));
      }
      setFocusStack(prev => [...prev.filter(id => id !== appId), appId]);
    }
  };

  const closeApp = (appId) => {
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
    // Pass focus to the next open window that is not minimized
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
      // Check if all currently open apps are already minimized
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

  const handleOpenFileInEditor = (file) => {
    setEditingFile(file);
    openApp('editor');
  };

  const handleSaveFileContent = (fileId, newContent) => {
    const updateNode = (node) => {
      if (node.id === fileId) {
        return { ...node, content: newContent, size: `${newContent.length} B` };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    
    // Update filesystem state
    setFileSystem(prev => updateNode(prev));
    // Update editing file display info
    setEditingFile(prev => prev && prev.id === fileId ? { ...prev, content: newContent, size: `${newContent.length} B` } : prev);
  };

  const handleReboot = () => {
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

  // Keyboard Event Listener: Double 'd' press and Cmd/Ctrl + D
  const lastDPressTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Check double 'd' / 'D'
      if (e.key === 'd' || e.key === 'D') {
        const target = e.target;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInput) {
          const now = Date.now();
          if (now - lastDPressTimeRef.current < 300) {
            // Double press!
            toggleShowDesktop();
            lastDPressTimeRef.current = 0; // reset
          } else {
            lastDPressTimeRef.current = now;
          }
        }
      }

      // 2. Cmd/Ctrl + D (Standard shortcut backup)
      if ((e.key === 'd' || e.key === 'D') && (e.ctrlKey || e.metaKey)) {
        const target = e.target;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInput) {
          e.preventDefault(); // Prevent standard browser bookmarking
          toggleShowDesktop();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openApps, minimizedApps, showDesktopActive]);

  // Determine if we have visible windows that are NOT minimized
  const hasVisibleWindows = openApps.some(id => !minimizedApps.includes(id));

  // Dynamic Scanline Overlay CSS
  const scanlineStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
    backgroundSize: '100% 4px, 6px 100%',
    opacity: scanlineOpacity / 100,
    zIndex: 9999,
    pointerEvents: 'none'
  };

  const renderWindowOrPlaceholder = (appId) => {
    const app = APPS.find(a => a.id === appId);
    const isOpen = openApps.includes(appId);
    const isMinimized = minimizedApps.includes(appId);
    const placement = gridPlacements[appId] || { row: 1, col: 1, colspan: 1, rowspan: 1 };
    
    const gridItemStyle = {
      gridColumn: `${placement.col} / span ${placement.colspan}`,
      gridRow: `${placement.row} / span ${placement.rowspan}`,
      pointerEvents: 'auto'
    };
    
    if (isOpen && !isMinimized) {
      const isFocused = activeAppId === appId;
      const zIndex = 100 + focusStack.indexOf(appId);
      
      return (
        <div style={gridItemStyle} key={appId}>
          <Window
            id={app.id}
            title={app.label}
            onClose={() => closeApp(app.id)}
            defaultPos={app.defaultPos}
            focused={isFocused}
            zIndex={zIndex}
            slidOut={false}
            onFocus={() => focusApp(app.id)}
            onRestore={() => restoreApp(app.id)}
            gridLayoutActive={true}
          >
            <AppContent 
              id={app.id} 
              fileSystem={fileSystem}
              setFileSystem={setFileSystem}
              onOpenFile={handleOpenFileInEditor}
              editingFile={editingFile}
              onSaveFile={handleSaveFileContent}
              onClose={() => closeApp(app.id)}
              gridLayoutActive={gridLayoutActive}
              setGridLayoutActive={setGridLayoutActive}
              themePreset={themePreset}
              setThemePreset={setThemePreset}
              scanlineOpacity={scanlineOpacity}
              setScanlineOpacity={setScanlineOpacity}
              dashboardBlur={dashboardBlur}
              setDashboardBlur={setDashboardBlur}
              soundActive={soundActive}
              setSoundActive={setSoundActive}
              gridPlacements={gridPlacements}
              setGridPlacements={setGridPlacements}
            />
          </Window>
        </div>
      );
    } else {
      return (
        <div className="grid-placeholder" style={gridItemStyle} key={`${appId}-placeholder`}>
          <div className="placeholder-status">
            <span className="placeholder-blink" />
            NODE OFFLINE
          </div>
          <div className="placeholder-title">{app.label}</div>
          <button className="placeholder-btn" onClick={() => toggleApp(appId)}>
            CONNECT LINK
          </button>
        </div>
      );
    }
  };

  return (
    <div className="os-wrapper">
      {/* Permanent Background HUD - blurs when windows are visible */}
      <div 
        className={`os-background ${hasVisibleWindows ? 'blurred' : ''}`}
        style={hasVisibleWindows ? { filter: `blur(${dashboardBlur}px) brightness(0.85)` } : {}}
      >
        <Dashboard />
      </div>

      {/* Cyber Screen Scanline Overlay */}
      <div style={scanlineStyle} />

      {/* Holographic Grid or Overlay Windows */}
      {gridLayoutActive ? (
        <div className="os-grid-layout">
          {renderWindowOrPlaceholder('terminal')}
          {renderWindowOrPlaceholder('files')}
          {renderWindowOrPlaceholder('tasks')}
          {renderWindowOrPlaceholder('notes')}
          {renderWindowOrPlaceholder('metrics')}
          {renderWindowOrPlaceholder('editor')}
        </div>
      ) : (
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
                focused={isFocused}
                zIndex={zIndex}
                slidOut={isMinimized}
                onFocus={() => focusApp(app.id)}
                onRestore={() => restoreApp(app.id)}
                gridLayoutActive={false}
              >
                <AppContent 
                  id={app.id} 
                  fileSystem={fileSystem}
                  setFileSystem={setFileSystem}
                  onOpenFile={handleOpenFileInEditor}
                  editingFile={editingFile}
                  onSaveFile={handleSaveFileContent}
                  onClose={() => closeApp(app.id)}
                  gridLayoutActive={gridLayoutActive}
                  setGridLayoutActive={setGridLayoutActive}
                  themePreset={themePreset}
                  setThemePreset={setThemePreset}
                  scanlineOpacity={scanlineOpacity}
                  setScanlineOpacity={setScanlineOpacity}
                  dashboardBlur={dashboardBlur}
                  setDashboardBlur={setDashboardBlur}
                  soundActive={soundActive}
                  setSoundActive={setSoundActive}
                  gridPlacements={gridPlacements}
                  setGridPlacements={setGridPlacements}
                />
              </Window>
            );
          })}
        </div>
      )}

      {/* Floating Settings Window - always on top of grid */}
      {openApps.includes('settings') && !minimizedApps.includes('settings') && (
        <Window
          key="settings"
          id="settings"
          title="SETTINGS"
          onClose={() => closeApp('settings')}
          defaultPos={{ x: 120, y: 120 }}
          focused={activeAppId === 'settings'}
          zIndex={500}
          slidOut={false}
          onFocus={() => focusApp('settings')}
          onRestore={() => restoreApp('settings')}
          gridLayoutActive={false}
        >
          <AppContent 
            id="settings" 
            fileSystem={fileSystem}
            setFileSystem={setFileSystem}
            onOpenFile={handleOpenFileInEditor}
            editingFile={editingFile}
            onSaveFile={handleSaveFileContent}
            onClose={() => closeApp('settings')}
            gridLayoutActive={gridLayoutActive}
            setGridLayoutActive={setGridLayoutActive}
            themePreset={themePreset}
            setThemePreset={setThemePreset}
            scanlineOpacity={scanlineOpacity}
            setScanlineOpacity={setScanlineOpacity}
            dashboardBlur={dashboardBlur}
            setDashboardBlur={setDashboardBlur}
            soundActive={soundActive}
            setSoundActive={setSoundActive}
            gridPlacements={gridPlacements}
            setGridPlacements={setGridPlacements}
          />
        </Window>
      )}

      {/* Bottom Holographic Split Docks */}
      <Dock
        apps={APPS}
        openApps={openApps}
        activeAppId={activeAppId}
        minimizedApps={minimizedApps}
        onToggleApp={toggleApp}
        onToggleShowDesktop={toggleShowDesktop}
        showDesktopActive={showDesktopActive}
        onReboot={handleReboot}
      />
    </div>
  );
}

export default App;
