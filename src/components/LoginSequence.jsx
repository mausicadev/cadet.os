import React, { useState, useEffect, useRef } from 'react';
import '../css/body.css';

const ScrambleText = ({ text, delay = 0, duration = 1200, className }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$-_+=[]{}<>^~*%';
    let frame = 0;
    const totalFrames = Math.floor(duration / 40);
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (frame >= totalFrames) {
          setDisplayText(text);
          clearInterval(interval);
          return;
        }
        
        const progress = frame / totalFrames;
        const resolvedCount = Math.floor(text.length * progress);
        
        let scrambled = '';
        for (let i = 0; i < text.length; i++) {
          if (i < resolvedCount) {
            scrambled += text[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        
        setDisplayText(scrambled);
        frame++;
      }, 40);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay, duration]);

  return <span className={className}>{displayText}</span>;
};

export default function LoginSequence({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step === 1 && usernameRef.current) usernameRef.current.focus();
    if (step === 2 && passwordRef.current) passwordRef.current.focus();
  }, [step]);

  useEffect(() => {
    if (step !== 4) return;
    setPhase(1);
    const timers = [
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => setPhase(6), 4200),
      setTimeout(() => {
        onLoginSuccess(username.trim().toUpperCase());
      }, 5100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playBeep = (freq, dur, vol = 0.06) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    playBeep(880, 0.1, 0.08);
    setStep(2);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      playBeep(1000, 0.15, 0.1);
      setStep(3);
      setTimeout(() => {
        playBeep(1200, 0.2, 0.1);
      }, 100);
      setTimeout(() => {
        setStep(4);
        playBeep(900, 0.3, 0.08);
      }, 2000);
    } else {
      playBeep(220, 0.3, 0.12);
      setErrorMsg('ACCESS DENIED');
      setTimeout(() => setErrorMsg(''), 2000);
    }
  };

  const passwordDots = password ? '●'.repeat(password.length) : '';

  return (
    <div className="container">
      <div className="ls-center">
        {step === 1 && (
          <>
            <h2 className="ls-prompt-text">
              <ScrambleText text="PLEASE IDENTIFY YOURSELF" duration={800} />
            </h2>
            <form onSubmit={handleUsernameSubmit}>
              <div className="ls-input-box-outer">
                <div className="ls-input-box-inner">
                  <span className="ls-input-display">
                    {username.toUpperCase()}
                    {showCursor && <span className="ls-cursor" />}
                  </span>
                  <input
                    ref={usernameRef}
                    type="text"
                    className="ls-hidden-input"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); playBeep(600 + Math.random() * 200, 0.03); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUsernameSubmit(e); }}
                    autoFocus
                  />
                </div>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="ls-prompt-text">
              <ScrambleText text="ENTER PASSWORD" duration={800} />
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="ls-input-box-outer">
                <div className="ls-input-box-inner">
                  <span className="ls-input-display">
                    {password && password.split('').map((_, i) => (
                      <span key={i} className="ls-password-dot" />
                    ))}
                    {showCursor && <span className="ls-cursor" />}
                  </span>
                  <input
                    ref={passwordRef}
                    type="password"
                    className="ls-hidden-input"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); playBeep(500 + Math.random() * 150, 0.03); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordSubmit(e); }}
                    autoFocus
                  />
                </div>
              </div>
              {errorMsg && <div className="ls-error">{errorMsg}</div>}
            </form>
          </>
        )}

        {step === 3 && (
          <h1 className="ls-granted">
            <ScrambleText text="ACCESS GRANTED" duration={1000} />
          </h1>
        )}

        {step === 4 && (
          <div className={`ls-seq ls-seq-p${phase}`}>
            <div className="ls-seq-solo-plus">+</div>

            <div className="ls-seq-frame">
              <span className="ls-seq-cp ls-seq-tl">+</span>
              <span className="ls-seq-cp ls-seq-tr">+</span>
              <span className="ls-seq-cp ls-seq-bl">+</span>
              <span className="ls-seq-cp ls-seq-br">+</span>

              <div className="ls-seq-box">
                <div className="ls-seq-grid-h" />
                <div className="ls-seq-grid-v" />
              </div>

              <div className="ls-seq-bk ls-seq-bk-tl" />
              <div className="ls-seq-bk ls-seq-bk-tr" />
              <div className="ls-seq-bk ls-seq-bk-bl" />
              <div className="ls-seq-bk ls-seq-bk-br" />

              <div className="ls-seq-avatar">
                <div className="ls-scan-line" />
                <img src="assets/img/avatar.jpg" alt="User" className="ls-seq-avatar-img" />
              </div>
            </div>

            <h2 className="ls-seq-hello text-orange">
              {phase >= 4 && <ScrambleText text={`HELLO, ${username.trim().toUpperCase()}`} duration={1000} />}
            </h2>
            <h3 className="ls-seq-welcome text-cyan">
              {phase >= 4 && <ScrambleText text="WELCOME BACK" delay={300} duration={1000} />}
            </h3>
          </div>
        )}
      </div>

      <style>{`
        .ls-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.5);
          transform-origin: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10002;
        }

        .ls-prompt-text {
          font-family: 'Dice', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 1px;
          color: #68fff0;
          text-shadow: 0 0 6px rgba(104, 255, 240, 0.5);
          margin: 0 0 5px 0;
          font-weight: normal;
        }

        .ls-input-box-outer {
          position: relative;
          border: 1px solid rgb(252, 104, 6);
          background: rgba(0, 0, 0, 0.25);
          padding: 6px;
          border-radius: 4px;
          min-width: 350px;
          box-shadow: 0 0 8px rgba(252, 104, 6, 0.3);
        }

        .ls-input-box-inner {
          position: relative;
          border: 1px solid #68fff0;
          height: 38px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          border-radius: 4px;
          box-sizing: border-box;
          box-shadow: inset 0 0 4px rgba(104, 255, 240, 0.2);
        }

        .ls-input-display {
          font-family: 'Dice', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 2px;
          color: #68fff0;
          text-shadow: 0 0 4px rgba(104, 255, 240, 0.4);
          display: flex;
          align-items: center;
          min-height: 1.5em;
          transform: translateY(5px);
        }

        .ls-password-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #68fff0;
          border-radius: 50%;
          margin-right: 6px;
          align-self: center;
          transform: translateY(-4px);
          box-shadow: 0 0 3px rgba(104, 255, 240, 0.6);
        }

        .ls-cursor {
          display: inline-block;
          width: 2px;
          height: 16px;
          background-color: #68fff0;
          vertical-align: middle;
          margin-left: 0px;
          transform: translateY(-4px);
          animation: ls-blink 2s step-end infinite;
        }

        @keyframes ls-blink {
          50% { opacity: 0; }
        }

        .ls-hidden-input {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          opacity: 0;
          cursor: text;
          font-size: 16px;
        }

        .ls-error {
          font-family: 'Dice', sans-serif;
          font-size: 0.9rem;
          color: #ff073a;
          text-shadow: 0 0 6px rgba(255, 7, 58, 0.5);
          margin-top: 20px;
          letter-spacing: 3px;
        }

        .ls-granted {
          font-family: 'Dice', sans-serif;
          font-size: 1.8rem;
          letter-spacing: 5px;
          color: rgb(252, 104, 6);
          text-shadow: 0 0 12px rgba(252, 104, 6, 0.7);
          margin: 0;
          font-weight: normal;
          animation: ls-pulse 0.8s ease-in-out infinite alternate;
        }

        @keyframes ls-pulse {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }

        .ls-hello {
          font-family: 'Dice', sans-serif;
          font-size: 1.3rem;
          letter-spacing: 4px;
          margin: 0 0 25px 0;
          font-weight: normal;
        }

        .text-orange {
          color: rgb(252, 104, 6);
          text-shadow: 0 0 8px rgba(252, 104, 6, 0.5);
        }

        .text-cyan {
          color: #68fff0;
          text-shadow: 0 0 6px rgba(104, 255, 240, 0.5);
        }

        .ls-avatar-frame {
          width: 140px;
          height: 140px;
          position: relative;
          border: 1px solid rgba(104, 255, 240, 0.35);
          padding: 6px;
          background: rgba(5, 12, 14, 0.8);
          box-shadow: 0 0 12px rgba(104, 255, 240, 0.08);
          margin-bottom: 25px;
        }

        .ls-avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 4px rgba(104, 255, 240, 0.4));
        }

        .ls-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #68fff0;
          border-style: solid;
          z-index: 2;
        }
        .ls-corner.tl { top: -2px; left: -2px; border-width: 2px 0 0 2px; }
        .ls-corner.tr { top: -2px; right: -2px; border-width: 2px 2px 0 0; }
        .ls-corner.bl { bottom: -2px; left: -2px; border-width: 0 0 2px 2px; }
        .ls-corner.br { bottom: -2px; right: -2px; border-width: 0 2px 2px 0; }

        .ls-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: #68fff0;
          box-shadow: 0 0 8px #68fff0;
          opacity: 0.7;
          z-index: 3;
          animation: ls-scan 2.5s linear infinite;
        }

        @keyframes ls-scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }

        .ls-welcome {
          font-family: 'Dice', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 4px;
          margin: 0;
          font-weight: normal;
        }

        .ls-seq {
          position: relative;
          width: 140px;
          height: 140px;
        }

        .ls-seq-solo-plus {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.3);
          font-family: 'Courier New', monospace;
          font-size: 2.5rem;
          color: rgb(252, 104, 6);
          text-shadow: 0 0 15px rgba(252, 104, 6, 0.7);
          opacity: 0;
          z-index: 5;
          pointer-events: none;
        }

        .ls-seq-p1 .ls-seq-solo-plus {
          animation: ls-plus-appear 0.5s ease forwards;
        }

        @keyframes ls-plus-appear {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .ls-seq-p2 .ls-seq-solo-plus,
        .ls-seq-p3 .ls-seq-solo-plus,
        .ls-seq-p4 .ls-seq-solo-plus,
        .ls-seq-p5 .ls-seq-solo-plus {
          opacity: 0;
          transform: translate(-50%, -50%) scale(2);
          transition: all 0.3s ease;
        }

        .ls-seq-p6 .ls-seq-solo-plus {
          animation: ls-plus-return 0.9s ease forwards;
        }

        @keyframes ls-plus-return {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
          25% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.6); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        }

        .ls-seq-frame {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0);
          transition: all 0.5s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .ls-seq-p2 .ls-seq-frame,
        .ls-seq-p3 .ls-seq-frame,
        .ls-seq-p4 .ls-seq-frame,
        .ls-seq-p5 .ls-seq-frame {
          opacity: 1;
          transform: scale(1);
        }

        .ls-seq-p6 .ls-seq-frame {
          opacity: 0;
          transform: scale(0);
          transition: all 0.45s cubic-bezier(0.4, 0, 0.8, 0.2);
        }

        .ls-seq-cp {
          position: absolute;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          color: rgb(252, 104, 6);
          text-shadow: 0 0 8px rgba(252, 104, 6, 0.5);
          line-height: 1;
          z-index: 2;
        }
        .ls-seq-tl { top: 0; left: 0; transform: translate(-50%, -50%); }
        .ls-seq-tr { top: 0; right: 0; transform: translate(50%, -50%); }
        .ls-seq-bl { bottom: 0; left: 0; transform: translate(-50%, 50%); }
        .ls-seq-br { bottom: 0; right: 0; transform: translate(50%, 50%); }

        .ls-seq-box {
          position: absolute;
          inset: 6px;
          border: 1.5px solid #68fff0;
          box-shadow: 0 0 8px rgba(104, 255, 240, 0.12), inset 0 0 8px rgba(104, 255, 240, 0.04);
          opacity: 0;
          transform: scale(0.85);
          transition: all 0.4s ease;
        }

        .ls-seq-p3 .ls-seq-box,
        .ls-seq-p4 .ls-seq-box,
        .ls-seq-p5 .ls-seq-box {
          opacity: 1;
          transform: scale(1);
        }

        .ls-seq-grid-h {
          position: absolute;
          top: 50%;
          left: 0; right: 0;
          height: 1px;
          background: rgba(104, 255, 240, 0.15);
        }
        .ls-seq-grid-v {
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(104, 255, 240, 0.15);
        }

        .ls-seq-bk {
          position: absolute;
          width: 18px;
          height: 18px;
          border-style: solid;
          border-color: rgba(104, 255, 240, 0.2);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .ls-seq-bk-tl { top: -14px; left: -14px; border-width: 1.5px 0 0 1.5px; }
        .ls-seq-bk-tr { top: -14px; right: -14px; border-width: 1.5px 1.5px 0 0; }
        .ls-seq-bk-bl { bottom: -14px; left: -14px; border-width: 0 0 1.5px 1.5px; }
        .ls-seq-bk-br { bottom: -14px; right: -14px; border-width: 0 1.5px 1.5px 0; }

        .ls-seq-p3 .ls-seq-bk,
        .ls-seq-p4 .ls-seq-bk,
        .ls-seq-p5 .ls-seq-bk {
          opacity: 1;
        }

        .ls-seq-avatar {
          position: absolute;
          inset: 6px;
          opacity: 0;
          transition: opacity 0.5s ease;
          overflow: hidden;
          background: rgba(5, 12, 14, 0.6);
        }

        .ls-seq-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.4) brightness(0.8) sepia(0.3) hue-rotate(130deg);
          mix-blend-mode: screen;
          opacity: 0.85;
        }

        .ls-seq-p4 .ls-seq-avatar,
        .ls-seq-p5 .ls-seq-avatar {
          opacity: 1;
        }

        .ls-seq-hello {
          position: absolute;
          bottom: calc(100% + 20px);
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          white-space: nowrap;
          font-family: 'Dice', sans-serif;
          font-size: 1.3rem;
          letter-spacing: 4px;
          margin: 0;
          font-weight: normal;
          opacity: 0;
          transition: all 0.5s ease;
        }

        .ls-seq-p4 .ls-seq-hello,
        .ls-seq-p5 .ls-seq-hello {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .ls-seq-p6 .ls-seq-hello {
          opacity: 0;
          transform: translateX(-50%) translateY(20px) scale(0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.8, 0.2);
        }

        .ls-seq-welcome {
          position: absolute;
          top: calc(100% + 20px);
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          white-space: nowrap;
          font-family: 'Dice', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 4px;
          margin: 0;
          font-weight: normal;
          opacity: 0;
          transition: all 0.5s ease 0.1s;
        }

        .ls-seq-p4 .ls-seq-welcome,
        .ls-seq-p5 .ls-seq-welcome {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .ls-seq-p6 .ls-seq-welcome {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px) scale(0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.8, 0.2);
        }
      `}</style>
    </div>
  );
}
