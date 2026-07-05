import React, { useState, useRef, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import TaskManager from './components/TaskManager';
import Radar from './components/Radar';
import Window from './components/Window';
import './css/os.css';

const APPS = [
  { id: 'terminal', label: 'TERMINAL', icon: '▸_', defaultPos: { x: 100, y: 100 } },
  { id: 'tasks', label: 'TASKS', icon: '☰', defaultPos: { x: 600, y: 100 } },
  { id: 'radar', label: 'RADAR', icon: '◎', defaultPos: { x: 1000, y: 400 } },
];

function AppContent({ id, ...props }) {
  switch (id) {
    case 'terminal': return <Terminal {...props} />;
    case 'tasks': return <TaskManager {...props} />;
    case 'radar': return <Radar {...props} />;
    default: return null;
  }
}

function App() {
  const [openApps, setOpenApps] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const menuRef = useRef(null);
  const launcherRef = useRef(null);

  const toggleApp = (appId) => {
    if (openApps.includes(appId)) {
      setOpenApps(openApps.filter(a => a !== appId));
    } else {
      setOpenApps([...openApps, appId]);
    }
  };

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 200);
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        !menuClosing &&
        menuRef.current && !menuRef.current.contains(e.target) &&
        launcherRef.current && !launcherRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, menuClosing]);

  return (
    <div className="os-wrapper">
      {/* Permanent Background HUD */}
      <div className="os-background">
        <Dashboard />
      </div>

      {/* Holographic Overlay Windows */}
      <div className="os-overlays">
        {APPS.map(app =>
          openApps.includes(app.id) && (
            <Window
              key={app.id}
              title={app.label}
              onClose={() => toggleApp(app.id)}
              defaultPos={app.defaultPos}
            >
              <AppContent id={app.id} />
            </Window>
          )
        )}
      </div>

      {/* App Launcher Button */}
      <button
        ref={launcherRef}
        className={`app-launcher ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        title="Applications"
      >
        {menuOpen ? (
          <span className="launcher-close">✕</span>
        ) : (
          <span className="launcher-icon">
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
          </span>
        )}
      </button>

      {/* Launcher Mini-Menu */}
      {menuOpen && (
        <div ref={menuRef} className={`launcher-menu ${menuClosing ? 'closing' : ''}`}>
          <div className="launcher-menu-header">APPLICATIONS</div>
          {APPS.map(app => (
            <button
              key={app.id}
              className={`launcher-menu-item ${openApps.includes(app.id) ? 'active' : ''}`}
              onClick={() => {
                toggleApp(app.id);
              }}
            >
              <span className="menu-icon">{app.icon}</span>
              <span className="menu-label">{app.label}</span>
              <span className="menu-status">
                {openApps.includes(app.id) ? 'ACTIVE' : ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
