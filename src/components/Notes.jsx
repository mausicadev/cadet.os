import React, { useState, useEffect } from 'react';
import '../css/notes.css';

export default function Notes({ fileSystem, setFileSystem, onOpenFile }) {
  const [activeId, setActiveId] = useState(null);
  const [syncStatus, setSyncStatus] = useState('SYNCED');

  // gasim folder-ul /usr pt note in arborele de directoare
  const getUsrDir = (node) => {
    if (node.id === 'usr') return node;
    if (node.children) {
      for (const child of node.children) {
        const found = getUsrDir(child);
        if (found) return found;
      }
    }
    return null;
  };

  const usrFolder = getUsrDir(fileSystem);
  const notes = usrFolder ? usrFolder.children.filter(c => c.type === 'file') : [];

  // selectam prima nota default cand se incarca app-ul
  useEffect(() => {
    if (notes.length > 0 && !activeId) {
      const defaultNote = notes.find(n => n.name === 'notes.txt') || notes[0];
      setActiveId(defaultNote.id);
    }
  }, [notes, activeId]);

  const current = notes.find(n => n.id === activeId);

  const updateContent = (newContent) => {
    if (!current) return;
    setSyncStatus('SAVING...');

    const updateNode = (node) => {
      if (node.id === current.id) {
        return {
          ...node,
          content: newContent,
          size: `${newContent.length} B`
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode)
        };
      }
      return node;
    };

    setFileSystem(prev => updateNode(prev));
    
    // sincronizarea e fake, dar arata bine
    setTimeout(() => {
      setSyncStatus('SYNCED');
    }, 400);
  };

  const addNote = () => {
    const noteName = prompt("ENTER NEW MEMO NAME (e.g. log.txt):");
    if (!noteName) return;
    
    const fname = noteName.toLowerCase().endsWith('.txt') 
      ? noteName.toLowerCase() 
      : `${noteName.toLowerCase()}.txt`;

    const newNote = {
      id: `note_${Date.now()}`,
      name: fname,
      type: 'file',
      size: '12 B',
      mime: 'TEXT',
      content: 'NEW MEMO CONTENT'
    };

    const addNode = (node) => {
      if (node.id === 'usr') {
        return { ...node, children: [...node.children, newNote] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addNode) };
      }
      return node;
    };

    setFileSystem(prev => addNode(prev));
    setActiveId(newNote.id);
  };

  const deleteNote = (noteId, e) => {
    e.stopPropagation();
    if (notes.length <= 1) {
      alert("ERROR: CORE SYS REQUIRE MINIMUM 1 MEMO NODE ACTIVE.");
      return;
    }

    const filterNode = (node) => {
      if (node.children) {
        node.children = node.children.filter(c => c.id !== noteId).map(filterNode);
      }
      return { ...node };
    };

    setFileSystem(prev => filterNode(prev));
    
    if (activeId === noteId) {
      const remaining = notes.filter(n => n.id !== noteId);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <div className="notes-container">
      {/* sidebar cu lista de note */}
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">BUNKER MEMOS</div>
        <div className="notes-list">
          {notes.map(note => (
            <div 
              key={note.id}
              className={`note-item ${note.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(note.id)}
            >
              <span className="note-name">{note.name.toUpperCase()}</span>
              <button 
                className="note-delete-btn"
                onClick={(e) => deleteNote(note.id, e)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="notes-sidebar-actions">
          <button className="note-btn glow-cyan" onClick={addNote}>
            + CREATE MEMO
          </button>
        </div>
      </div>

      {/* editorul de text */}
      <div className="notes-editor">
        {current ? (
          <>
            <div className="notes-editor-header">
              <div className="active-note-title">
                PATH: <span className="glow-cyan">/usr/{current.name.toUpperCase()}</span>
              </div>
              <div className="note-save-status glow-orange">
                [{syncStatus}]
              </div>
            </div>
            <div className="notes-editor-textarea-wrapper">
              <textarea
                value={current.content}
                onChange={(e) => updateContent(e.target.value)}
                className="notes-textarea"
                spellCheck="false"
              />
            </div>
          </>
        ) : (
          <div className="notes-editor-empty">
            NO ACTIVE NOTE STACK LOADED.
          </div>
        )}
      </div>
    </div>
  );
}
