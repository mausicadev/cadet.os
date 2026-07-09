import React, { useRef, useState } from 'react';
import '../css/settings.css';

const DEMO_SENSORS = [
  {
    "id": "sensor_001",
    "city": "Your City",
    "country": "XX",
    "last_temperature": "22.5",
    "last_humidity": "65.0",
    "last_pressure": 101325,
    "last_co2": 450,
    "last_noise": "55.0",
    "last_voc": 250000,
    "last_ch2o": 15,
    "last_pm1": 2,
    "last_pm25": 3,
    "last_pm10": 5
  },
  {
    "id": "sensor_002",
    "city": "Another City",
    "country": "XX",
    "last_temperature": "20.1",
    "last_humidity": "60.0",
    "last_pressure": 101500,
    "last_co2": 420,
    "last_noise": "50.0",
    "last_voc": 200000,
    "last_ch2o": 10,
    "last_pm1": 1,
    "last_pm25": 2,
    "last_pm10": 4
  }
];

export default function Settings({
  themePreset,
  setThemePreset,
  scanlineOpacity,
  setScanlineOpacity,
  dashboardBlur,
  setDashboardBlur,
  soundActive,
  setSoundActive,
  sensorApiUrl,
  setSensorApiUrl,
  sensorHeadersText,
  setSensorHeadersText,
  sensorRefreshIntervalSeconds,
  setSensorRefreshIntervalSeconds,
  windowLayouts,
  setWindowLayouts,
  sensorData,
  setSensorData,
  sensorFetchStatus,
  sensorFetchError,
  fetchSensorData,
  weatherApiUrl,
  setWeatherApiUrl
}) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [showData, setShowData] = useState(false);
  // poate ar tb sa pun si un buton de clear data

  const downloadJson = () => {
    const payload = Array.isArray(sensorData) && sensorData.length > 0 ? sensorData : DEMO_SENSORS;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sensor-data.json';
    link.click();
    URL.revokeObjectURL(url);
    setMsg('Sensor data JSON downloaded.');
  };

  // TODO: validare mai buna pt json
  const importConfig = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result || '{}');
        if (Array.isArray(imported)) {
          setSensorData(imported);
          setMsg('Sensor data imported.');
          return;
        }
        if (imported.sensorApiUrl) setSensorApiUrl(imported.sensorApiUrl);
        if (imported.url) setSensorApiUrl(imported.url);
        if (typeof imported.sensorHeadersText === 'string') {
          setSensorHeadersText(imported.sensorHeadersText);
        } else if (imported.sensorHeaders) {
          setSensorHeadersText(JSON.stringify(imported.sensorHeaders, null, 2));
        } else if (imported.headers) {
          setSensorHeadersText(JSON.stringify(imported.headers, null, 2));
        }
        if (imported.layout) {
          if (imported.layout.themePreset) {
            setThemePreset(imported.layout.themePreset);
          }
          if (typeof imported.layout.scanlineOpacity === 'number') {
            setScanlineOpacity(imported.layout.scanlineOpacity);
          }
          if (typeof imported.layout.dashboardBlur === 'number') {
            setDashboardBlur(imported.layout.dashboardBlur);
          }
          if (typeof imported.layout.soundActive === 'boolean') {
            setSoundActive(imported.layout.soundActive);
          }
          if (imported.layout.windowLayouts) {
            setWindowLayouts(imported.layout.windowLayouts);
          }
        }
        setMsg('Configuration imported.');
      } catch {
        setMsg('Import failed. Please use a valid JSON file.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
      <div className="settings-header">
        SYSTEM CONTROL PANEL v2.1.0
      </div>

      <div className="settings-grid" style={{ flex: 1, overflow: 'auto', paddingRight: '8px' }}>
        {/* sectiunea de display/layout */}
        <div className="settings-group">
          <div className="settings-group-title">DISPLAY MODE & LAYOUT</div>
          
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


        {/* system defaults - url, headers, interval */}
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

          <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span className="settings-label">SENSOR DATA URL:</span>
            <input
              type="text"
              value={sensorApiUrl}
              onChange={(e) => setSensorApiUrl(e.target.value)}
              style={{ width: '100%', background: '#000', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', padding: '6px 8px', fontFamily: 'monospace', fontSize: '0.72rem' }}
              placeholder="https://data.uradmonitor.com/api/v1/devices"
            />
          </div>

          <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span className="settings-label">SENSOR HEADERS (JSON):</span>
            <textarea
              value={sensorHeadersText}
              onChange={(e) => setSensorHeadersText(e.target.value)}
              rows={3}
              style={{ 
                width: '100%', 
                background: '#000', 
                color: 'var(--theme-primary, #68fff0)', 
                border: '1px solid var(--theme-border)', 
                padding: '6px 8px', 
                fontFamily: 'monospace', 
                fontSize: '0.72rem', 
                resize: 'vertical',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              placeholder='{} (leave empty for public APIs)'
            />
            <style>{`textarea::-webkit-scrollbar { display: none; }`}</style>
            <span style={{ fontSize: '0.65rem', color: 'rgba(104, 255, 240, 0.6)' }}>Optional. Use {} if no auth needed.</span>
          </div>

          <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span className="settings-label">AUTO FETCH INTERVAL:</span>
            <input
              type="number"
              min={5}
              step={1}
              value={sensorRefreshIntervalSeconds}
              onChange={(e) => setSensorRefreshIntervalSeconds(Math.max(5, Number(e.target.value) || 10))}
              style={{ width: '100px', background: '#000', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', padding: '6px 8px', fontFamily: 'monospace', fontSize: '0.72rem' }}
            />
            <span style={{ fontSize: '0.65rem', color: 'rgba(104, 255, 240, 0.6)' }}>Auto-fetch sensor data every {sensorRefreshIntervalSeconds} seconds.</span>
          </div>

          <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span className="settings-label">WEATHER FORECAST URL (Open-Meteo):</span>
            <input
              type="text"
              value={weatherApiUrl || ''}
              onChange={(e) => setWeatherApiUrl && setWeatherApiUrl(e.target.value)}
              style={{ width: '100%', background: '#000', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', padding: '6px 8px', fontFamily: 'monospace', fontSize: '0.72rem' }}
              placeholder="https://api.open-meteo.com/v1/forecast?latitude=45.75&longitude=21.22&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto"
            />
            <span style={{ fontSize: '0.65rem', color: 'rgba(104, 255, 240, 0.6)' }}>Fetches daily weather for the right HUD panel. Uses Open-Meteo by default.</span>
          </div>

          <div className="settings-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={downloadJson}
              style={{ background: 'rgba(104, 255, 240, 0.12)', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', padding: '6px 10px', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              DOWNLOAD JSON
            </button>
            <button
              type="button"
              onClick={fetchSensorData}
              style={{ background: 'rgba(104, 255, 240, 0.12)', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', padding: '6px 10px', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              FETCH NOW
            </button>
            <button
              type="button"
              onClick={() => setShowData(v => !v)}
              style={{
                background: showData ? 'rgba(104, 255, 240, 0.25)' : 'rgba(104, 255, 240, 0.12)',
                color: 'var(--theme-primary, #68fff0)',
                border: `1px solid ${showData ? 'var(--theme-primary, #68fff0)' : 'var(--theme-border)'}`,
                padding: '6px 10px', cursor: 'pointer', fontSize: '0.72rem',
                boxShadow: showData ? '0 0 6px var(--theme-glow)' : 'none'
              }}
            >
              {showData ? '▲ HIDE DATA' : '▼ VIEW DATA'}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{ background: 'rgba(104, 255, 240, 0.12)', color: 'var(--theme-primary, #68fff0)', border: '1px solid var(--theme-border)', padding: '6px 10px', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              IMPORT CONFIG
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={importConfig} style={{ display: 'none' }} />
          </div>

          {/* toggle pt viewer - TODO: animatie? */}
          {showData && (
            <div style={{
              marginTop: '10px',
              border: '1px solid var(--theme-border)',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              {/* data inspector panel */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(104,255,240,0.06)',
                borderBottom: '1px solid var(--theme-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--theme-primary, #68fff0)', fontWeight: 'bold', letterSpacing: '0.1em' }}>
                    ◈ SENSOR DATA INSPECTOR
                  </span>
                  <span style={{
                    fontSize: '0.6rem', fontFamily: 'monospace',
                    background: Array.isArray(sensorData) && sensorData.length > 0 ? 'rgba(104,255,240,0.15)' : 'rgba(252,104,6,0.15)',
                    color: Array.isArray(sensorData) && sensorData.length > 0 ? 'var(--theme-primary, #68fff0)' : 'rgb(252,104,6)',
                    border: `1px solid ${Array.isArray(sensorData) && sensorData.length > 0 ? 'var(--theme-border)' : 'rgba(252,104,6,0.4)'}`,
                    padding: '1px 6px', borderRadius: '2px',
                  }}>
                    {Array.isArray(sensorData) ? sensorData.length : 0} DEVICE{Array.isArray(sensorData) && sensorData.length === 1 ? '' : 'S'}
                  </span>
                </div>
                <span style={{ fontSize: '0.58rem', color: 'rgba(104,255,240,0.35)', fontStyle: 'italic' }}>live · updates on fetch</span>
              </div>

              <div style={{ maxHeight: '460px', overflowY: 'auto', padding: '10px 12px' }}>
                {Array.isArray(sensorData) && sensorData.length > 0 ? (
                  <>
                    {sensorData.map((device, idx) => {
                      const knownFields = [
                        { field: 'last_temperature', label: 'Temperature',        dash: 'Bunker/Outside Temp °C' },
                        { field: 'last_co2',         label: 'CO₂',               dash: 'Center circle + ppm display' },
                        { field: 'last_co2_raw',     label: 'CO₂ (raw)',          dash: 'Fallback for CO₂' },
                        { field: 'last_ch2o',        label: 'CH₂O',              dash: 'Right widget 1' },
                        { field: 'last_noise',       label: 'Noise',             dash: 'Right widget 2' },
                        { field: 'last_humidity',    label: 'Humidity',          dash: 'Right widget 3' },
                        { field: 'last_pressure',    label: 'Pressure',          dash: 'Right widget 4 (÷100)' },
                        { field: 'last_voc',         label: 'VOC',               dash: 'Left widget 1' },
                        { field: 'last_pm10',        label: 'PM10',              dash: 'Left widget 2' },
                        { field: 'last_pm25',        label: 'PM2.5',             dash: 'Left widget 3' },
                        { field: 'last_pm1',         label: 'PM1',               dash: 'Left widget 4' },
                        { field: 'last_cpm',         label: 'CPM',               dash: 'Radiation (×factor)' },
                        { field: 'factor',           label: 'Factor',            dash: 'Radiation multiplier' },
                      ];
                      const knownKeys = [...knownFields.map(f => f.field), 'id', 'city', 'country'];
                      const extraFields = Object.entries(device).filter(([k]) => !knownKeys.includes(k));
                      const mappedCount = knownFields.filter(({ field }) => device[field] !== undefined && device[field] !== null).length;

                      return (
                        <div key={idx} style={{ marginBottom: idx < sensorData.length - 1 ? '16px' : 0 }}>
                          {/* device header cu id si locatie */}
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginBottom: '8px', paddingBottom: '6px',
                            borderBottom: '1px solid rgba(104,255,240,0.12)',
                          }}>
                            <span style={{ fontSize: '0.65rem', color: 'rgb(252,104,6)', fontWeight: 'bold', letterSpacing: '0.08em' }}>
                              DEVICE {idx + 1}
                            </span>
                            {device.id && (
                              <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {device.id}
                              </span>
                            )}
                            {device.city && (
                              <span style={{ fontSize: '0.6rem', color: 'rgba(104,255,240,0.6)' }}>
                                📍 {device.city}{device.country ? `, ${device.country}` : ''}
                              </span>
                            )}
                            <span style={{
                              marginLeft: 'auto', fontSize: '0.58rem', fontFamily: 'monospace',
                              color: mappedCount > 6 ? 'var(--theme-primary, #68fff0)' : mappedCount > 2 ? 'rgb(252,200,6)' : 'rgb(252,104,6)',
                            }}>
                              {mappedCount}/{knownFields.length} fields mapped
                            </span>
                          </div>

                          {/* tabelul cu field-uri known */}
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.62rem', fontFamily: 'monospace', marginBottom: '10px' }}>
                            <thead>
                              <tr style={{ background: 'rgba(104,255,240,0.04)' }}>
                                <th style={{ textAlign: 'left', color: 'rgba(104,255,240,0.4)', padding: '4px 8px', fontWeight: 'normal', borderBottom: '1px solid rgba(104,255,240,0.1)', width: '28%' }}>FIELD</th>
                                <th style={{ textAlign: 'left', color: 'rgba(104,255,240,0.4)', padding: '4px 8px', fontWeight: 'normal', borderBottom: '1px solid rgba(104,255,240,0.1)', width: '20%' }}>VALUE</th>
                                <th style={{ textAlign: 'left', color: 'rgba(104,255,240,0.4)', padding: '4px 8px', fontWeight: 'normal', borderBottom: '1px solid rgba(104,255,240,0.1)', width: '12%' }}>STATUS</th>
                                <th style={{ textAlign: 'left', color: 'rgba(104,255,240,0.4)', padding: '4px 8px', fontWeight: 'normal', borderBottom: '1px solid rgba(104,255,240,0.1)' }}>DASHBOARD USE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {knownFields.map(({ field, label, dash }) => {
                                const val = device[field];
                                const present = val !== undefined && val !== null;
                                return (
                                  <tr key={field} style={{ borderBottom: '1px solid rgba(104,255,240,0.04)' }}>
                                    <td style={{ padding: '4px 8px', color: present ? 'var(--theme-primary, #68fff0)' : 'rgba(255,255,255,0.2)' }}>{field}</td>
                                    <td style={{ padding: '4px 8px', color: present ? '#e8fff8' : 'rgba(255,255,255,0.18)', fontStyle: present ? 'normal' : 'italic', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {present ? String(val) : '—'}
                                    </td>
                                    <td style={{ padding: '4px 8px' }}>
                                      <span style={{
                                        fontSize: '0.55rem', padding: '1px 5px', borderRadius: '2px',
                                        background: present ? 'rgba(104,255,240,0.1)' : 'rgba(252,104,6,0.1)',
                                        color: present ? 'var(--theme-primary, #68fff0)' : 'rgba(252,104,6,0.7)',
                                        border: `1px solid ${present ? 'rgba(104,255,240,0.2)' : 'rgba(252,104,6,0.2)'}`,
                                      }}>
                                        {present ? '✓ OK' : '✗ MISS'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '4px 8px', color: present ? 'rgba(104,255,240,0.55)' : 'rgba(255,255,255,0.12)', fontStyle: present ? 'normal' : 'italic' }}>{dash}</td>
                                  </tr>
                                );
                              })}
                              {/* extra fields care nu-s mapate */}
                              {extraFields.length > 0 && (
                                <tr>
                                  <td colSpan={4} style={{ padding: '6px 8px 2px', color: 'rgba(252,104,6,0.5)', fontSize: '0.58rem', letterSpacing: '0.06em' }}>
                                    ── EXTRA FIELDS (not mapped to dashboard) ──
                                  </td>
                                </tr>
                              )}
                              {extraFields.map(([k, v]) => (
                                <tr key={k} style={{ borderBottom: '1px solid rgba(252,104,6,0.06)' }}>
                                  <td style={{ padding: '4px 8px', color: 'rgba(252,104,6,0.7)' }}>{k}</td>
                                  <td style={{ padding: '4px 8px', color: '#fff' }}>{String(v)}</td>
                                  <td style={{ padding: '4px 8px' }}>
                                    <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '2px', background: 'rgba(252,104,6,0.08)', color: 'rgba(252,104,6,0.6)', border: '1px solid rgba(252,104,6,0.15)' }}>
                                      EXTRA
                                    </span>
                                  </td>
                                  <td style={{ padding: '4px 8px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>unmapped</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}

                    {/* raw json la final */}
                    <div style={{ borderTop: '1px solid rgba(104,255,240,0.1)', paddingTop: '10px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.62rem', color: 'rgba(104,255,240,0.45)', letterSpacing: '0.06em' }}>▸ RAW JSON PAYLOAD</span>
                        <span style={{ fontSize: '0.57rem', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>select all to copy</span>
                      </div>
                      <pre style={{
                        fontSize: '0.58rem', color: 'rgba(104,255,240,0.75)',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '10px', overflowX: 'auto', maxHeight: '180px', overflowY: 'auto',
                        border: '1px solid rgba(104,255,240,0.1)',
                        margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        lineHeight: '1.5',
                      }}>
                        {JSON.stringify(sensorData, null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px', opacity: 0.3 }}>◈</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                      No sensor data loaded.
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(104,255,240,0.3)', marginTop: '4px' }}>
                      Press FETCH NOW to retrieve data from the configured URL.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* status messages */}
          {(msg || sensorFetchStatus || sensorFetchError) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {msg && (
                <div className="glow-cyan" style={{ fontSize: '0.7rem' }}>{msg}</div>
              )}
              <div className="glow-cyan" style={{ fontSize: '0.7rem' }}>{sensorFetchStatus}</div>
              {sensorFetchError && (
                <div style={{ color: 'rgb(252, 104, 6)', fontSize: '0.7rem' }}>{sensorFetchError}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
