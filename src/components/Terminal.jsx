import React, { useState, useRef, useEffect } from 'react';
import '../css/terminal.css';

export default function Terminal({ onTriggerLaunch }) {
  const [history, setHistory] = useState([
    "CadetOS v1.0.0",
    "Type 'help' for a list of commands."
  ]);
  const [commandCount, setCommandCount] = useState(0);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const cmdRef = useRef(null);

  // auto-focus la input cand deschidem terminalul
  useEffect(() => {
    cmdRef.current?.focus({ preventScroll: true });
  }, []);

  const runCmd = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, `> ${cmd}`];
      setCommandCount((count) => count + 1);
      
      const lower = cmd.toLowerCase();
      if (lower === 'help') {
        newHistory.push("Available commands: help, clear, status, reboot, launch, pulse, mission");
      } else if (lower === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (lower === 'status') {
        newHistory.push("All systems nominal. Bunker temperature: 15 'C. Airlock pressure: 0.97 bar.");
      } else if (lower === 'reboot') {
        newHistory.push("Initiating reboot sequence...");
        setTimeout(() => window.location.reload(), 1000);
      } else if (lower === 'launch') {
        newHistory.push("Initiating launch sequence... Exceeding PPM safety threshold!");
        if (onTriggerLaunch) {
          onTriggerLaunch();
        }
      } else if (lower === 'pulse') {
        newHistory.push("Beacon pulse dispatched to the outer perimeter.");
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('cadet-pulse'));
        }
      } else if (lower === 'mission') {
        newHistory.push(`Mission note: ${commandCount + 1} loops completed. Keep the beacon warm and the logs clean.`);
      } else if (cmd !== '') {
        newHistory.push(`Command not found: ${cmd}`);
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  // auto-scroll la ultimul rand din terminal cand se adauga comenzi
  useEffect(() => {
    if (endRef.current) {
      const container = endRef.current.closest('.terminal-output');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [history]);

  return (
    <div className="terminal-container">
      <div className="terminal-banner">
        <span>CONSOLE // BUNKER NETWORK</span>
        <span>AUTH: LEVEL 4</span>
      </div>
      <div className="terminal-output">
        {history.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="terminal-input-row">
        <span className="prompt">&gt;</span>
        <input 
          ref={cmdRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={runCmd}
          className="terminal-input"
        />
      </div>
    </div>
  );
}
