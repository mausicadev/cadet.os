import React, { useEffect, useRef, useState } from 'react';
import '../css/editor.css';

export default function LaunchPage({ onReturn }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const [countdown, setCountdown] = useState('?????');
  const [statusText, setStatusText] = useState('SYSTEM ON STANDBY');
  const [isLaunched, setIsLaunched] = useState(false);
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const [isExploded, setIsExploded] = useState(false);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playBeep = (freq, duration) => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  };

  const playNoiseSound = (freqVal, duration, isExplosion = false) => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freqVal, ctx.currentTime);
      if (isExplosion) {
        filter.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + duration);
      } else {
        filter.frequency.linearRampToValueAtTime(30, ctx.currentTime + duration);
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(isExplosion ? 0.95 : 0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
    } catch (e) {
      console.warn(e);
    }
  };

  const startSequence = () => {
    if (isLaunched) return;
    setIsLaunched(true);
    setStatusText('COUNTDOWN INITIATED');

    setCountdown('3');
    playBeep(880, 0.2);

    setTimeout(() => {
      setCountdown('2');
      playBeep(880, 0.2);
    }, 1000);

    setTimeout(() => {
      setCountdown('1');
      playBeep(880, 0.2);
    }, 2000);

    setTimeout(() => {
      setCountdown('IGNITION');
      setStatusText('PROPULSION ACTIVE');
      playBeep(1760, 0.5);
      playNoiseSound(150, 4.0, false);
      startCanvasAnimation();
    }, 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        startSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLaunched]);

  const startCanvasAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let rocketY = canvas.height + 100;
    const rocketX = canvas.width / 2;
    let speed = 1.5;
    
    const particles = [];
    const sparks = [];
    const shockwaves = [];

    class SmokeParticle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 15;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 4 + 2;
        this.size = Math.random() * 8 + 5;
        this.alpha = 1.0;
        this.color = Math.random() > 0.6 ? 'rgba(252, 104, 6, 0.7)' : 'rgba(120, 120, 120, 0.4)';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += 0.15;
        this.alpha -= 0.02;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class ExplodeParticle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 4 + 1.5;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.015 + 0.008;
        this.color = color;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.alpha -= this.decay;
        this.size *= 0.97;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const triggerExplosion = (ex, ey) => {
      setIsExploded(true);
      setStatusText('DETONATION SUCCESSFUL');
      setCountdown('DETONATED');
      playNoiseSound(80, 2.5, true);

      const colors = ['#ff073a', 'rgb(252, 104, 6)', '#68fff0', '#ffea00', '#ffffff'];
      for (let i = 0; i < 90; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        sparks.push(new ExplodeParticle(ex, ey, color));
      }

      shockwaves.push({ r: 5, maxR: 350, alpha: 0.9 });

      let shakeTime = 0;
      const shakeInterval = setInterval(() => {
        shakeTime += 50;
        if (shakeTime < 1500) {
          setShake({
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20
          });
        } else {
          clearInterval(shakeInterval);
          setShake({ x: 0, y: 0 });
          setTimeout(() => {
            onReturn();
          }, 1000);
        }
      }, 50);
    };

    const animateLoop = () => {
      ctx.fillStyle = 'rgba(5, 12, 14, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(104, 255, 240, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (rocketY > canvas.height / 2) {
        rocketY -= speed;
        speed += 0.15;

        for (let i = 0; i < 3; i++) {
          particles.push(new SmokeParticle(rocketX, rocketY + 60));
        }

        setShake({
          x: (Math.random() - 0.5) * (speed * 0.3),
          y: (Math.random() - 0.5) * (speed * 0.3)
        });

        ctx.save();
        ctx.strokeStyle = '#68fff0';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(104, 255, 240, 0.6)';
        
        ctx.beginPath();
        ctx.moveTo(rocketX, rocketY - 60);
        ctx.lineTo(rocketX - 15, rocketY - 20);
        ctx.lineTo(rocketX - 15, rocketY + 40);
        ctx.lineTo(rocketX - 30, rocketY + 60);
        ctx.lineTo(rocketX - 15, rocketY + 50);
        ctx.lineTo(rocketX - 8, rocketY + 50);
        ctx.lineTo(rocketX - 5, rocketY + 60);
        ctx.lineTo(rocketX + 5, rocketY + 60);
        ctx.lineTo(rocketX + 8, rocketY + 50);
        ctx.lineTo(rocketX + 15, rocketY + 50);
        ctx.lineTo(rocketX + 30, rocketY + 60);
        ctx.lineTo(rocketX + 15, rocketY + 40);
        ctx.lineTo(rocketX + 15, rocketY - 20);
        ctx.closePath();
        ctx.stroke();
        
        ctx.strokeStyle = 'rgb(252, 104, 6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rocketX, rocketY - 30);
        ctx.lineTo(rocketX, rocketY + 30);
        ctx.stroke();
        ctx.restore();
      } else if (!isExploded) {
        triggerExplosion(rocketX, rocketY);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();
        if (sparks[i].alpha <= 0) {
          sparks.splice(i, 1);
        }
      }

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += 10;
        sw.alpha -= 0.03;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.strokeStyle = 'rgba(252, 104, 6, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(rocketX, rocketY, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
          shockwaves.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  return (
    <div
      className="os-wrapper"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050c0e',
        color: '#68fff0',
        zIndex: 10000,
        fontFamily: "'Courier New', Courier, monospace",
        overflow: 'hidden',
        transform: `translate(${shake.x}px, ${shake.y}px)`
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div
        className="cyber-editor-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          backgroundColor: 'rgba(5, 12, 14, 0.85)',
          border: '2px solid rgba(104, 255, 240, 0.4)',
          borderRadius: '4px',
          boxShadow: '0 0 30px rgba(104, 255, 240, 0.15)',
          zIndex: 5,
          pointerEvents: 'auto',
          display: isExploded ? 'none' : 'flex'
        }}
      >
        <div className="editor-control-header" style={{ padding: '8px 12px' }}>
          <div className="file-info">
            <span className="file-label">MODULE:</span>
            <span className="file-name glow-orange">LAUNCH_MODULE.SYS</span>
            <span className="file-mime glow-cyan">[STANDBY]</span>
          </div>
          <div>
            <span className="stat-val glow-cyan" style={{ fontSize: '0.7rem' }}>SECURE LINK</span>
          </div>
        </div>

        <div
          className="editor-textarea-wrapper"
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '20px',
            textAlign: 'center'
          }}
          onClick={startSequence}
        >
          <div
            className="glow-cyan"
            style={{
              fontSize: countdown === 'IGNITION' ? '3rem' : '4.5rem',
              fontWeight: 'bold',
              letterSpacing: '5px',
              fontFamily: 'sans-serif',
              marginBottom: '15px',
              transition: 'all 0.1s ease',
              color: countdown === 'IGNITION' ? 'rgb(252, 104, 6)' : '#68fff0'
            }}
          >
            {countdown}
          </div>

          {!isLaunched && (
            <div style={{ fontSize: '0.8rem', color: 'rgba(104, 255, 240, 0.6)', lineHeight: '1.6' }}>
              <p className="glow-orange" style={{ margin: '5px 0' }}>SNEAK PEEKS & UPCOMING:</p>
              <p style={{ margin: '0', letterSpacing: '1px' }}>SUGAR ROCKET ... SWEET PROJ ... EXPLOSIONS</p>
              <br />
              <button
                className="editor-act-btn save glow-cyan-border"
                style={{ fontSize: '0.85rem', padding: '6px 16px', marginTop: '10px' }}
              >
                INITIATE PROPULSION
              </button>
              <p style={{ fontSize: '0.65rem', color: 'rgba(104, 255, 240, 0.4)', marginTop: '8px' }}>
                [ Press SPACE / ENTER or CLICK to launch ]
              </p>
            </div>
          )}

          {isLaunched && countdown !== 'IGNITION' && (
            <div style={{ color: 'rgb(252, 104, 6)', fontSize: '0.9rem', letterSpacing: '2px' }}>
              ☣ DANGER: IGNITION CORE CHARGING ☣
            </div>
          )}
        </div>

        <div className="editor-footer" style={{ padding: '8px 12px' }}>
          <div className="footer-stat">
            <span>STATUS:</span>
            <span className="stat-val glow-orange">{statusText}</span>
          </div>
          <div className="footer-stat" style={{ marginLeft: 'auto' }}>
            <span>ENGINES:</span>
            <span className="stat-val glow-cyan">{isLaunched ? 'ACTIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
