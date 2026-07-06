import React, { useState, useEffect } from 'react';
import '../css/notes.css';

export default function Notes({ fileSystem, setFileSystem, onOpenFile }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('SYNCED');

  // Helper to find the 'usr' folder
  const findUsrFolder = (node) => {
    if (node.id === 'usr') return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findUsrFolder(child);
        if (found) return found;
      }
    }
    return null;
  };

  const usrFolder = findUsrFolder(fileSystem);
  const notes = usrFolder ? usrFolder.children.filter(c => c.type === 'file') : [];

  // Default to first note if none selected
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      // Find notes.txt if it exists, otherwise use the first one
      const defaultNote = notes.find(n => n.name === 'notes.txt') || notes[0];
      setSelectedNoteId(defaultNote.id);
    }
  }, [notes, selectedNoteId]);

  const activeNote = notes.find(n => n.id === selectedNoteId);

  const handleContentChange = (newContent) => {
    if (!activeNote) return;
    setSaveStatus('SAVING...');

    const updateNode = (node) => {
      if (node.id === activeNote.id) {
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
    
    // Simulate slight lag for cyber/hacker saving visual status
    setTimeout(() => {
      setSaveStatus('SYNCED');
    }, 400);
  };

  const handleAddNote = () => {
    const noteName = prompt("ENTER NEW MEMO NAME (e.g. log.txt):");
    if (!noteName) return;
    
    const formattedName = noteName.toLowerCase().endsWith('.txt') 
      ? noteName.toLowerCase() 
      : `${noteName.toLowerCase()}.txt`;

    const newNote = {
      id: `note_${Date.now()}`,
      name: formattedName,
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
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (noteId, e) => {
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
    
    if (selectedNoteId === noteId) {
      const remaining = notes.filter(n => n.id !== noteId);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <div className="notes-container">
      {/* Sidebar Panel */}
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">BUNKER MEMOS</div>
        <div className="notes-list">
          {notes.map(note => (
            <div 
              key={note.id}
              className={`note-item ${note.id === selectedNoteId ? 'active' : ''}`}
              onClick={() => setSelectedNoteId(note.id)}
            >
              <span className="note-name">{note.name.toUpperCase()}</span>
              <button 
                className="note-delete-btn"
                onClick={(e) => handleDeleteNote(note.id, e)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="notes-sidebar-actions">
          <button className="note-btn glow-cyan" onClick={handleAddNote}>
            + CREATE MEMO
          </button>
        </div>
      </div>

      {/* Memo Editor Content */}
      <div className="notes-editor">
        {activeNote ? (
          <>
            <div className="notes-editor-header">
              <div className="active-note-title">
                PATH: <span className="glow-cyan">/usr/{activeNote.name.toUpperCase()}</span>
              </div>
              <div className="note-save-status glow-orange">
                [{saveStatus}]
              </div>
            </div>
            <div className="notes-editor-textarea-wrapper">
              <textarea
                value={activeNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
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
