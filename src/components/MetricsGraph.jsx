import React, { useEffect, useRef, useState } from 'react';
import '../css/metrics.css';

// Helper to draw a glowing grid line chart on a canvas
function drawChart(canvas, data, color, maxVal = 100, label = '') {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Draw Grid Lines
  ctx.strokeStyle = 'rgba(104, 255, 240, 0.08)';
  ctx.lineWidth = 1;
  const gridSpacing = 20;
  
  // Horizontal grid
  for (let y = gridSpacing; y < h; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // Vertical grid
  for (let x = gridSpacing; x < w; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  if (data.length === 0) return;

  // Draw data line
  const paddingX = 10;
  const paddingY = 10;
  const chartW = w - paddingX * 2;
  const chartH = h - paddingY * 2;

  ctx.beginPath();
  const getX = (index) => paddingX + (index / (data.length - 1)) * chartW;
  const getY = (val) => h - paddingY - (val / maxVal) * chartH;

  ctx.moveTo(getX(0), getY(data[0]));
  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(getX(i), getY(data[i]));
  }

  // Neon glowing line properties
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0; // Reset shadow

  // Create gradient area under line
  ctx.beginPath();
  ctx.moveTo(getX(0), h - paddingY);
  for (let i = 0; i < data.length; i++) {
    ctx.lineTo(getX(i), getY(data[i]));
  }
  ctx.lineTo(getX(data.length - 1), h - paddingY);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, paddingY, 0, h - paddingY);
  // Extract rgb values for transparency
  const rgb = color.startsWith('rgb') ? color : 'rgb(104, 255, 240)';
  const baseRgb = rgb.replace('rgb', 'rgba').replace(')', '');
  grad.addColorStop(0, `${baseRgb}, 0.25)`);
  grad.addColorStop(1, `${baseRgb}, 0)`);
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw current value dot
  const lastIndex = data.length - 1;
  const lastX = getX(lastIndex);
  const lastY = getY(data[lastIndex]);

  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0; // Reset
}

export default function MetricsGraph() {
  const cpuCanvasRef = useRef(null);
  const gpuCanvasRef = useRef(null);
  const netCanvasRef = useRef(null);

  // States for live metrics history (25 points)
  const [cpuHistory, setCpuHistory] = useState(() => Array(25).fill(25));
  const [gpuHistory, setGpuHistory] = useState(() => Array(25).fill(15));
  const [netHistory, setNetHistory] = useState(() => Array(25).fill(1.2)); // in MB/s

  // Current stats
  const [stats, setStats] = useState({
    cpuUsage: 25,
    cpuTemp: 48,
    cpuSpeed: 3.8,
    gpuUsage: 15,
    gpuTemp: 44,
    gpuMem: 2.1, // GB
    gpuMemMax: 8.0,
    ramUsage: 6.8, // GB
    ramMax: 16.0,
    netSpeedDown: 1.2, // MB/s
    netSpeedUp: 0.3, // MB/s
    uptime: '02:44:12',
  });

  // Uptime tick
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const parts = prev.uptime.split(':').map(Number);
        let [h, m, s] = parts;
        s += 1;
        if (s >= 60) {
          s = 0;
          m += 1;
        }
        if (m >= 60) {
          m = 0;
          h += 1;
        }
        const pad = (n) => String(n).padStart(2, '0');
        return {
          ...prev,
          uptime: `${pad(h)}:${pad(m)}:${pad(s)}`
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update metrics data every second
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate CPU: stays around 20-50%, occasionally spikes
      const cpu = Math.max(5, Math.min(99, Math.round(stats.cpuUsage + (Math.random() - 0.5) * 12)));
      const cpuTemp = Math.round(40 + (cpu / 99) * 35 + (Math.random() - 0.5) * 4);
      const cpuSpeed = parseFloat((3.2 + (cpu / 100) * 1.6).toFixed(2));

      // Simulate GPU: stays around 10-30%, unless loaded
      const gpu = Math.max(2, Math.min(99, Math.round(stats.gpuUsage + (Math.random() - 0.5) * 8)));
      const gpuTemp = Math.round(38 + (gpu / 99) * 32 + (Math.random() - 0.5) * 3);
      const gpuMem = parseFloat((1.8 + (gpu / 100) * 3.5).toFixed(1));

      // Simulate RAM
      const ram = parseFloat(Math.max(4.0, Math.min(15.2, stats.ramUsage + (Math.random() - 0.5) * 0.3)).toFixed(1));

      // Simulate Network
      const netDown = parseFloat(Math.max(0.1, Math.min(45.0, stats.netSpeedDown + (Math.random() - 0.5) * 1.5)).toFixed(1));
      const netUp = parseFloat(Math.max(0.05, Math.min(12.0, stats.netSpeedUp + (Math.random() - 0.5) * 0.4)).toFixed(2));

      setStats(prev => ({
        ...prev,
        cpuUsage: cpu,
        cpuTemp,
        cpuSpeed,
        gpuUsage: gpu,
        gpuTemp,
        gpuMem,
        ramUsage: ram,
        netSpeedDown: netDown,
        netSpeedUp: netUp,
      }));

      // Update history arrays
      setCpuHistory(prev => [...prev.slice(1), cpu]);
      setGpuHistory(prev => [...prev.slice(1), gpu]);
      setNetHistory(prev => [...prev.slice(1), netDown]);

    }, 1000);

    return () => clearInterval(interval);
  }, [stats]);

  // Draw charts when history updates
  useEffect(() => {
    drawChart(cpuCanvasRef.current, cpuHistory, 'rgb(104, 255, 240)', 100);
    drawChart(gpuCanvasRef.current, gpuHistory, 'rgb(252, 104, 6)', 100);
    drawChart(netCanvasRef.current, netHistory, 'rgb(104, 255, 240)', 50); // limit down graph to 50MB/s
  }, [cpuHistory, gpuHistory, netHistory]);

  const ramPercent = Math.round((stats.ramUsage / stats.ramMax) * 100);

  return (
    <div className="metrics-container">
      {/* Top OS Hud Meta Bar */}
      <div className="metrics-meta-bar">
        <div className="meta-item">
          <span className="meta-label">SYSTEM CLOCK</span>
          <span className="meta-value glow-cyan">NOMINAL</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">UPTIME</span>
          <span className="meta-value">{stats.uptime}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">CORE STATE</span>
          <span className="meta-value glow-orange">STABLE</span>
        </div>
      </div>

      {/* Grid of Monitors */}
      <div className="metrics-grid">
        {/* CPU Monitor */}
        <div className="metric-card">
          <div className="card-header">
            <span className="card-title">CPU MONITOR</span>
            <span className="card-badge glow-cyan">{stats.cpuUsage}%</span>
          </div>
          <div className="chart-wrapper">
            <canvas ref={cpuCanvasRef} width={270} height={110} className="metric-canvas" />
          </div>
          <div className="card-details">
            <div className="detail-row">
              <span>FREQUENCY</span>
              <span className="glow-cyan">{stats.cpuSpeed} GHz</span>
            </div>
            <div className="detail-row">
              <span>TEMPERATURE</span>
              <span>{stats.cpuTemp} °C</span>
            </div>
          </div>
        </div>

        {/* GPU Monitor */}
        <div className="metric-card">
          <div className="card-header">
            <span className="card-title">GPU CORE HUD</span>
            <span className="card-badge glow-orange">{stats.gpuUsage}%</span>
          </div>
          <div className="chart-wrapper">
            <canvas ref={gpuCanvasRef} width={270} height={110} className="metric-canvas" />
          </div>
          <div className="card-details">
            <div className="detail-row">
              <span>VRAM UTILS</span>
              <span className="glow-orange">{stats.gpuMem} GB / {stats.gpuMemMax} GB</span>
            </div>
            <div className="detail-row">
              <span>CORE TEMP</span>
              <span>{stats.gpuTemp} °C</span>
            </div>
          </div>
        </div>

        {/* RAM Monitor */}
        <div className="metric-card ram-card">
          <div className="card-header">
            <span className="card-title">MEM / STORAGE HUD</span>
            <span className="card-badge glow-cyan">{ramPercent}%</span>
          </div>
          <div className="ram-content">
            <div className="ram-circular-display">
              {/* Dual bars */}
              <div className="progress-ring-label">
                <span className="main-val">{stats.ramUsage}</span>
                <span className="sub-val">GB USED</span>
              </div>
              {/* HTML5 radial indicator using SVG */}
              <svg width="90" height="90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="radial-bg" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="radial-fill glow-cyan"
                  style={{
                    strokeDasharray: 251.2,
                    strokeDashoffset: 251.2 - (251.2 * ramPercent) / 100
                  }}
                />
              </svg>
            </div>
            <div className="ram-details-box">
              <div className="detail-row">
                <span>ACTIVE RAM</span>
                <span>{stats.ramUsage} GB</span>
              </div>
              <div className="detail-row">
                <span>TOTAL VIRT</span>
                <span>{stats.ramMax} GB</span>
              </div>
              <div className="detail-row">
                <span>SWAP INDEX</span>
                <span>1.4 GB / 4.0 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Monitor */}
        <div className="metric-card">
          <div className="card-header">
            <span className="card-title">NET STREAM SPEED</span>
            <span className="card-badge glow-cyan">ON</span>
          </div>
          <div className="chart-wrapper">
            <canvas ref={netCanvasRef} width={270} height={110} className="metric-canvas" />
          </div>
          <div className="card-details">
            <div className="detail-row">
              <span>DOWNSTREAM</span>
              <span className="glow-cyan">▸ {stats.netSpeedDown} MB/s</span>
            </div>
            <div className="detail-row">
              <span>UPSTREAM</span>
              <span>◂ {stats.netSpeedUp} MB/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
