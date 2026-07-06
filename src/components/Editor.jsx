import React, { useState, useEffect } from 'react';
import '../css/editor.css';

export default function Editor({ file, onSaveFile, onClose }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (file) {
      setContent(file.content);
    } else {
      setContent('');
    }
  }, [file]);

  const handleSave = () => {
    if (file) {
      onSaveFile(file.id, content);
      alert(`CHANGES SAVED TO ${file.name.toUpperCase()}`);
    }
  };

  if (!file) {
    return (
      <div className="editor-empty-state">
        <div className="empty-message">☢ NO ACTIVE FILE LINK DETECTED ☢</div>
        <p>DOUBLE-CLICK A FILE IN THE FILES MANAGER TO INITIATE HOLOGRAPHIC EDITING ROUTINE.</p>
      </div>
    );
  }

  const charCount = content.length;
  const lineCount = content.split('\n').length;

  return (
    <div className="cyber-editor-container">
      {/* Editor Control Header */}
      <div className="editor-control-header">
        <div className="file-info">
          <span className="file-label">EDITING SOURCE:</span>
          <span className="file-name glow-cyan">{file.name}</span>
          <span className="file-mime glow-orange">[{file.mime}]</span>
        </div>
        <div className="editor-actions-row">
          <button className="editor-act-btn cancel" onClick={onClose}>
            CANCEL
          </button>
          <button className="editor-act-btn save glow-cyan-border" onClick={handleSave}>
            SAVE CHANGES
          </button>
        </div>
      </div>

      {/* Editor Text Area */}
      <div className="editor-textarea-wrapper">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="editor-textarea-field"
          spellCheck="false"
        />
      </div>

      {/* Editor Footer / Info panel */}
      <div className="editor-footer">
        <div className="footer-stat">
          <span>LINES:</span>
          <span className="stat-val glow-cyan">{lineCount}</span>
        </div>
        <div className="footer-stat">
          <span>SIZE:</span>
          <span className="stat-val glow-orange">{charCount} B</span>
        </div>
        <div className="footer-stat">
          <span>BUFFER STACK:</span>
          <span className="stat-val glow-cyan">READY</span>
        </div>
      </div>
    </div>
  );
}
