import React from 'react';
import '../css/settings.css';

export default function Settings({
  gridLayoutActive,
  setGridLayoutActive,
  themePreset,
  setThemePreset,
  scanlineOpacity,
  setScanlineOpacity,
  dashboardBlur,
  setDashboardBlur,
  soundActive,
  setSoundActive,
  gridPlacements,
  setGridPlacements
}) {
  const renderAppCoords = (appId, label) => {
    const placement = gridPlacements[appId] || { row: 1, col: 1, colspan: 1, rowspan: 1 };
    
    const updatePlacement = (key, value) => {
      setGridPlacements(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          [key]: parseInt(value)
        }
      }));
    };

    return (
      <div className="grid-config-row" key={appId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed rgba(104, 255, 240, 0.1)' }}>
        <span className="grid-config-label" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{label}</span>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div>
            R: 
            <select 
              value={placement.row} 
              onChange={(e) => updatePlacement('row', e.target.value)}
              style={{ background: '#000', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', fontFamily: 'monospace', fontSize: '0.7rem', marginLeft: '4px', padding: '1px 4px', outline: 'none' }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div>
            C: 
            <select 
              value={placement.col} 
              onChange={(e) => updatePlacement('col', e.target.value)}
              style={{ background: '#000', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', fontFamily: 'monospace', fontSize: '0.7rem', marginLeft: '4px', padding: '1px 4px', outline: 'none' }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            SPAN: 
            <select 
              value={placement.colspan} 
              onChange={(e) => updatePlacement('colspan', e.target.value)}
              style={{ background: '#000', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', fontFamily: 'monospace', fontSize: '0.7rem', marginLeft: '4px', padding: '1px 4px', outline: 'none' }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        SYSTEM CONTROL PANEL v2.0.5
      </div>

      <div className="settings-grid">
        {/* INTERFACE GRID GROUP */}
        <div className="settings-group">
          <div className="settings-group-title">DISPLAY MODE & LAYOUT</div>
          
          <div className="settings-row">
            <span className="settings-label">HACKER GRID LAYOUT:</span>
            <div 
              className={`cyber-toggle ${gridLayoutActive ? 'active' : ''}`}
              onClick={() => setGridLayoutActive(!gridLayoutActive)}
            >
              <div className="cyber-toggle-knob" />
            </div>
          </div>

          <div className="settings-row">
            <span className="settings-label">BACKGROUND BLUR ({dashboardBlur}px):</span>
            <input 
              type="range"
              min="0"
              max="15"
              value={dashboardBlur}
              onChange={(e) => setDashboardBlur(parseInt(e.target.value))}
              className="cyber-slider"
            />
          </div>

          <div className="settings-row">
            <span className="settings-label">SCANLINE INTENSITY ({scanlineOpacity}%):</span>
            <input 
              type="range"
              min="0"
              max="100"
              value={scanlineOpacity}
              onChange={(e) => setScanlineOpacity(parseInt(e.target.value))}
              className="cyber-slider"
            />
          </div>
        </div>

        {/* GRID COORDINATES CONFIGURATION */}
        {gridLayoutActive && (
          <div className="settings-group">
            <div className="settings-group-title">GRID COORDINATES (4x2 SETUP)</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderAppCoords('files', 'FILES MANAGER')}
              {renderAppCoords('editor', 'CODE EDITOR')}
              {renderAppCoords('terminal', 'TERMINAL')}
              {renderAppCoords('metrics', 'METRICS')}
              {renderAppCoords('tasks', 'TASKS')}
              {renderAppCoords('notes', 'NOTES')}
            </div>
          </div>
        )}



        {/* AUDIO & SYSTEM CORE */}
        <div className="settings-group">
          <div className="settings-group-title">SYSTEM DEFAULTS</div>

          <div className="settings-row">
            <span className="settings-label">AUDIO CUES / RADAR PINGS:</span>
            <div 
              className={`cyber-toggle ${soundActive ? 'active' : ''}`}
              onClick={() => setSoundActive(!soundActive)}
            >
              <div className="cyber-toggle-knob" />
            </div>
          </div>

          <div className="settings-row">
            <span className="settings-label">BUNKER NETWORK BEACON:</span>
            <span className="glow-cyan" style={{ fontSize: '0.7rem' }}>ACTIVE (94% STR)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
