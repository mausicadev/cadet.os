import React, { useState } from 'react';
import '../css/filemanager.css';

// SVG Folder Icon for the tree sidebar
function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', filter: 'drop-shadow(0 0 2px rgba(104, 255, 240, 0.4))' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

// SVG Folder Icon for grid items (larger)
function FolderGridIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(104, 255, 240, 0.5))' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

// SVG File Icon for grid items (larger)
function FileGridIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(104, 255, 240, 0.5))' }}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
  );
}

export default function FileManager({ fileSystem, setFileSystem, onOpenFile }) {
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find a folder by ID in the tree
  const findFolder = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        if (child.type === 'folder') {
          const found = findFolder(child, id);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const getFolderPath = (node, targetId, path = []) => {
    if (node.id === targetId) {
      return [...path, node];
    }
    if (node.children) {
      for (const child of node.children) {
        if (child.type === 'folder') {
          const res = getFolderPath(child, targetId, [...path, node]);
          if (res.length > 0) return res;
        }
      }
    }
    return [];
  };

  const currentFolder = findFolder(fileSystem, currentFolderId) || fileSystem;
  const pathList = getFolderPath(fileSystem, currentFolderId);

  // Filter children based on search
  const visibleItems = currentFolder.children.filter(item => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedFile = currentFolder.children.find(f => f.id === selectedFileId && f.type === 'file');

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedFileId(null);
    } else {
      setSelectedFileId(item.id);
    }
  };

  const handleDoubleClick = (item) => {
    if (item.type === 'file') {
      onOpenFile && onOpenFile(item);
    }
  };

  const handleDeleteItem = (itemId, e) => {
    e.stopPropagation();
    const filterNode = (node) => {
      if (node.children) {
        node.children = node.children.filter(c => c.id !== itemId).map(filterNode);
      }
      return { ...node };
    };

    setFileSystem(prev => filterNode(prev));
    if (selectedFileId === itemId) {
      setSelectedFileId(null);
    }
  };

  const handleCreateFile = () => {
    const fileName = prompt("ENTER FILE NAME (e.g. config.txt):");
    if (!fileName) return;

    const newFile = {
      id: `file_${Date.now()}`,
      name: fileName.toLowerCase(),
      type: 'file',
      size: '100 B',
      mime: fileName.split('.').pop().toUpperCase() || 'TXT',
      content: `# NEW FILE: ${fileName}\nCREATED ON CADET OS TERMINAL`
    };

    const addNode = (node) => {
      if (node.id === currentFolderId) {
        return { ...node, children: [...node.children, newFile] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addNode) };
      }
      return node;
    };

    setFileSystem(prev => addNode(prev));
  };

  const handleCreateFolder = () => {
    const folderName = prompt("ENTER FOLDER NAME:");
    if (!folderName) return;

    const newFolder = {
      id: `folder_${Date.now()}`,
      name: folderName.toLowerCase(),
      type: 'folder',
      children: []
    };

    const addNode = (node) => {
      if (node.id === currentFolderId) {
        return { ...node, children: [...node.children, newFolder] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addNode) };
      }
      return node;
    };

    setFileSystem(prev => addNode(prev));
  };

  return (
    <div className="file-manager-container">
      {/* Search and Navigation Headers */}
      <div className="fm-header">
        <div className="fm-path-bar">
          {pathList.map((node, i) => (
            <span key={node.id} className="path-segment">
              <span className="segment-btn" onClick={() => {
                setCurrentFolderId(node.id);
                setSelectedFileId(null);
              }}>{node.name}</span>
              {i < pathList.length - 1 && <span className="path-separator">/</span>}
            </span>
          ))}
        </div>
        <div className="fm-search">
          <input
            type="text"
            placeholder="SEARCH CODEBASE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fm-search-input"
          />
        </div>
      </div>

      {/* Main Split Section */}
      <div className="fm-body">
        {/* Sidebar Folder Navigation */}
        <div className="fm-sidebar">
          <div className="sidebar-title">NODE DIRECTORIES</div>
          <div className="folder-tree">
            <div className={`folder-tree-node ${currentFolderId === 'root' ? 'active' : ''}`} onClick={() => {
              setCurrentFolderId('root');
              setSelectedFileId(null);
            }}>
              <FolderIcon /> ROOT
            </div>
            {fileSystem.children.filter(n => n.type === 'folder').map(folder => (
              <div key={folder.id} style={{ marginLeft: '12px' }}>
                <div className={`folder-tree-node ${currentFolderId === folder.id ? 'active' : ''}`} onClick={() => {
                  setCurrentFolderId(folder.id);
                  setSelectedFileId(null);
                }}>
                  <FolderIcon /> {folder.name}
                </div>
                {folder.children.filter(n => n.type === 'folder').map(sub => (
                  <div
                    key={sub.id}
                    className={`folder-tree-node ${currentFolderId === sub.id ? 'active' : ''}`}
                    style={{ marginLeft: '12px' }}
                    onClick={() => {
                      setCurrentFolderId(sub.id);
                      setSelectedFileId(null);
                    }}
                  >
                    <FolderIcon /> {sub.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="storage-meter">
            <div className="meter-label">
              <span>BUNKER SOLID STATE</span>
              <span>1.2 TB / 4.0 TB</span>
            </div>
            <div className="meter-bar">
              <div className="meter-progress" style={{ width: '30%' }} />
            </div>
          </div>
        </div>

        {/* Directory Explorer Pane */}
        <div className="fm-explorer">
          <div className="explorer-actions">
            <button className="explorer-btn glow-cyan" onClick={handleCreateFile}>+ NEW FILE</button>
            <button className="explorer-btn glow-cyan" onClick={handleCreateFolder}>+ NEW FOLDER</button>
          </div>

          <div className="items-grid">
            {visibleItems.length === 0 ? (
              <div className="no-items">DIRECTORY EMPTY</div>
            ) : (
              visibleItems.map(item => (
                <div
                  key={item.id}
                  className={`grid-item ${item.id === selectedFileId || (item.type === 'folder' && item.id === currentFolderId) ? 'selected' : ''}`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  <div className="item-icon-wrapper">
                    {item.type === 'folder' ? <FolderGridIcon /> : <FileGridIcon />}
                  </div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta-line">
                    {item.type === 'folder' ? 'DIR' : item.size}
                  </div>
                  <button className="item-delete-btn" onClick={(e) => handleDeleteItem(item.id, e)}>×</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Metadata & Preview Panel */}
        <div className="fm-preview-pane">
          <div className="sidebar-title">FILE META</div>
          {selectedFile ? (
            <div className="preview-details">
              <div className="preview-row">
                <span className="prev-label">FILENAME</span>
                <span className="prev-val glow-cyan">{selectedFile.name}</span>
              </div>
              <div className="preview-row">
                <span className="prev-label">FILE SIZE</span>
                <span className="prev-val">{selectedFile.size}</span>
              </div>
              <div className="preview-row">
                <span className="prev-label">DATATYPE</span>
                <span className="prev-val glow-orange">{selectedFile.mime}</span>
              </div>
              <div className="preview-content-box">
                <div className="preview-content-title">CONTENT PREVIEW:</div>
                <pre className="preview-content-text">{selectedFile.content}</pre>
              </div>
              <button className="fm-action-btn glow-cyan" onClick={() => handleDoubleClick(selectedFile)}>
                OPEN EDITOR
              </button>
            </div>
          ) : (
            <div className="preview-empty">NO FILE SELECTED</div>
          )}
        </div>
      </div>
    </div>
  );
}
