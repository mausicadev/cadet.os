import React from 'react';
import '../css/dock.css';

export default function Dock({
  apps,
  openApps,
  activeAppId,
  minimizedApps,
  onToggleApp,
  onToggleShowDesktop,
  showDesktopActive,
  onReboot,
  onLogout
}) {
  
  // apps separate pt stanga si dreapta sa arate splituit (5 left, 5 right)
  const leftApps = apps.filter(app => ['tasks', 'notes', 'editor', 'files', 'terminal'].includes(app.id));
  const rightApps = apps.filter(app => ['metrics', 'settings'].includes(app.id));

  const dockBtn = (app) => {
    const isOpen = openApps.includes(app.id);
    const isActive = activeAppId === app.id;
    const isMinimized = minimizedApps.includes(app.id);

    let dotCls = 'dot';
    if (isOpen) {
      if (isMinimized) {
        dotCls += ' open minimized';
      } else if (isActive) {
        dotCls += ' open active';
      } else {
        dotCls += ' open';
      }
    }

    return (
      <button
        key={app.id}
        className={`dock-item ${isActive ? 'active-item' : ''} ${isMinimized ? 'minimized-item' : ''}`}
        onClick={() => onToggleApp(app.id)}
        title={app.label}
      >
        <span className="dock-icon">{app.icon}</span>
        <span className="dock-tooltip">{app.label}</span>
        <span className="dock-indicator-container">
          <span className={dotCls} />
        </span>
      </button>
    );
  };

  return (
    <div className="os-split-dock-container">
      {/* dock stanga - terminal, files, tasks, notes */}
      <div className="os-dock left">
        <div className="dock-scanline" />
        <div className="dock-apps">
          {leftApps.map(dockBtn)}
        </div>
      </div>

      {/* dock dreapta - metrics, editor, settings + butoane speciale */}
      <div className="os-dock right">
        <div className="dock-scanline" />
        <div className="dock-apps">
          {rightApps.map(dockBtn)}
          
          {/* show-desktop button removed - use double 'D' shortcut */}

          {/* buton house blueprint */}
          <button
            className="dock-item"
            onClick={() => window.location.hash = '#/house'}
            title="House Blueprint"
          >
            <span className="dock-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <span className="dock-tooltip">HOUSE</span>
          </button>

          {/* buton reboot (dramatic lol) */}
          <button
            className="dock-item power-reset-btn glow-orange"
            onClick={onReboot}
            title="Nuclear Emergency System Reboot"
          >
            <span className="dock-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(252, 104, 6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(252, 104, 6, 0.5))' }}>
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
            </span>
            <span className="dock-tooltip">POWER RESET</span>
          </button>

          {/* buton logout */}
          {onLogout && (
            <button
              className="dock-item"
              onClick={onLogout}
              title="Logout"
            >
              <span className="dock-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary, #68fff0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px var(--theme-glow, rgba(104, 255, 240, 0.5)))' }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span className="dock-tooltip">LOGOUT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
