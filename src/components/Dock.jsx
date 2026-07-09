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
  onReboot
}) {
  
  // apps separate pt stanga si dreapta sa arate splituit
  const leftApps = apps.filter(app => ['terminal', 'files', 'tasks', 'notes'].includes(app.id));
  const rightApps = apps.filter(app => ['metrics', 'editor', 'settings'].includes(app.id));

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
        </div>
      </div>
    </div>
  );
}
