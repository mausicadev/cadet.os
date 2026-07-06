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
  // Split apps: 4 on the Left, 3 on the Right (Radar removed)
  const leftApps = apps.filter(app => ['terminal', 'files', 'tasks', 'notes'].includes(app.id));
  const rightApps = apps.filter(app => ['metrics', 'editor', 'settings'].includes(app.id));

  const renderDockItem = (app) => {
    const isOpen = openApps.includes(app.id);
    const isActive = activeAppId === app.id;
    const isMinimized = minimizedApps.includes(app.id);

    let indicatorClass = 'dot';
    if (isOpen) {
      if (isMinimized) {
        indicatorClass += ' open minimized';
      } else if (isActive) {
        indicatorClass += ' open active';
      } else {
        indicatorClass += ' open';
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
          <span className={indicatorClass} />
        </span>
      </button>
    );
  };

  return (
    <div className="os-split-dock-container">
      {/* LEFT DOCK - 3 Items */}
      <div className="os-dock left">
        <div className="dock-scanline" />
        <div className="dock-apps">
          {leftApps.map(renderDockItem)}
        </div>
      </div>

      {/* RIGHT DOCK - 3 Items */}
      <div className="os-dock right">
        <div className="dock-scanline" />
        <div className="dock-apps">
          {rightApps.map(renderDockItem)}
          
          {/* Action Item: Show Desktop Toggle */}
          <button
            className={`dock-item show-desktop-btn ${showDesktopActive ? 'active-desktop' : ''}`}
            onClick={onToggleShowDesktop}
            title={showDesktopActive ? "Restore All Windows" : "Minimize All (Show Desktop - Double 'D')"}
          >
            <span className="dock-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(252, 104, 6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(252, 104, 6, 0.5))' }}>
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </span>
            <span className="dock-tooltip">SHOW DESKTOP</span>
          </button>

          {/* Action Item: Power Reset */}
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
