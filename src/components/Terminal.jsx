import React, { useState, useRef, useEffect } from 'react';
import '../css/terminal.css';

export default function Terminal() {
  const [history, setHistory] = useState([
    "CadetOS v1.0.0",
    "Type 'help' for a list of commands."
  ]);
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
      
      // comenzi disponibile simple
      // TODO: mai multe comenzi interesante in viitor
      if (cmd.toLowerCase() === 'help') {
        newHistory.push("Available commands: help, clear, status, reboot");
      } else if (cmd.toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd.toLowerCase() === 'status') {
        newHistory.push("All systems nominal. Bunker temperature: 15 'C.");
      } else if (cmd.toLowerCase() === 'reboot') {
        newHistory.push("Initiating reboot sequence...");
        setTimeout(() => window.location.reload(), 1000);
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
