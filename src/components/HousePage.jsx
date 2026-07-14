import React from 'react';
import '../css/body.css';

export default function HousePage({ onNavigateToBunker, onLogout }) {
  return (
    <div className="container">
      <button className="hp-logout-btn" onClick={onLogout} title="Logout">
        LOGOUT
      </button>

      <style>{`
        .hp-logout-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10003;
          background: transparent;
          border: 1px solid rgba(104, 255, 240, 0.25);
          color: rgba(104, 255, 240, 0.5);
          font-family: cyberpunky, 'Courier New', monospace;
          font-size: 0.75rem;
          letter-spacing: 3px;
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hp-logout-btn:hover {
          color: #68fff0;
          border-color: #68fff0;
          text-shadow: 0 0 6px rgba(104, 255, 240, 0.5);
          box-shadow: 0 0 8px rgba(104, 255, 240, 0.15);
        }
      `}</style>
    </div>
  );
}
