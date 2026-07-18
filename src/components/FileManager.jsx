import React, { useState } from 'react';
import '../css/filemanager.css';


function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', filter: 'drop-shadow(0 0 2px rgba(104, 255, 240, 0.4))' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}


function FolderGridIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(104, 255, 240, 0.5))' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}


function FileGridIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(104, 255, 240, 0.5))' }}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
  );
}

export default function FileManager({ fileSystem, setFileSystem, onOpenFile }) {
  const [dirId, setDirId] = useState('root');
  const [fileId, setFileId] = useState(null);
  const [search, setSearch] = useState('');

  // parcurgem recursiv structura sa gasim un folder dupa id
  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (!node.children) return null;

    for (const child of node.children) {
      if (child.type === 'folder') {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }

    return null;
  };

  // construim calea (breadcrumb-ul) pana la folder
  const buildPathToNode = (node, targetId, path = []) => {
    if (node.id === targetId) return [...path, node];
    if (!node.children) return [];

    for (const child of node.children) {
      if (child.type === 'folder') {
        const nestedPath = buildPathToNode(child, targetId, [...path, node]);
        if (nestedPath.length > 0) return nestedPath;
      }
    }

    return [];
  };

  const currentDir = findNodeById(fileSystem, dirId) || fileSystem;
  const pathList = buildPathToNode(fileSystem, dirId);
  const visible = currentDir.children.filter((item) => {
    if (!search) return true;
    return item.name.toLowerCase().includes(search.toLowerCase());
  });
  const selectedFile = currentDir.children.find(
    (item) => item.id === fileId && item.type === 'file'
  );

  const onItemClick = (item) => {
    if (item.type === 'folder') {
      setDirId(item.id);
      setFileId(null);
      return;
    }

    setFileId(item.id);
  };

  const openItem = (item) => {
    if (item.type === 'file') {
      onOpenFile?.(item);
    }
  };

  const deleteItem = (itemId, event) => {
    event.stopPropagation();

    const removeNode = (node) => {
      if (!node.children) return { ...node };

      node.children = node.children.filter((child) => child.id !== itemId).map(removeNode);
      return { ...node };
    };

    setFileSystem((prev) => removeNode(prev));

    if (fileId === itemId) {
      setFileId(null);
    }
  };

  const createFile = () => {
    const fileName = prompt('ENTER FILE NAME (e.g. config.txt):');
    if (!fileName) return;

    const newFile = {
      id: `file_${Date.now()}`,
      name: fileName.toLowerCase(),
      type: 'file',
      size: '100 B',
      mime: fileName.split('.').pop().toUpperCase() || 'TXT',
      content: `# NEW FILE: ${fileName}\nCREATED IN CADET OS`
    };

    const addNode = (node) => {
      if (node.id === dirId) {
        return { ...node, children: [...node.children, newFile] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addNode) };
      }
      return node;
    };

    setFileSystem((prev) => addNode(prev));
  };

  const createFolder = () => {
    const folderName = prompt('ENTER FOLDER NAME:');
    if (!folderName) return;

    const newFolder = {
      id: `folder_${Date.now()}`,
      name: folderName.toLowerCase(),
      type: 'folder',
      children: []
    };

    const addNode = (node) => {
      if (node.id === dirId) {
        return { ...node, children: [...node.children, newFolder] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addNode) };
      }
      return node;
    };

    setFileSystem((prev) => addNode(prev));
  };

  return (
    <div className="file-manager-container">
      <div className="fm-header">
        <div className="fm-path-bar">
          {pathList.map((node, index) => (
            <span key={node.id} className="path-segment">
              <span
                className="segment-btn"
                onClick={() => {
                  setDirId(node.id);
                  setFileId(null);
                }}
              >
                {node.name}
              </span>
              {index < pathList.length - 1 && <span className="path-separator">/</span>}
            </span>
          ))}
        </div>
        <div className="fm-search">
          <input
            type="text"
            placeholder="SEARCH CODEBASE..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="fm-search-input"
          />
        </div>
      </div>

      <div className="fm-body">
        <div className="fm-sidebar">
          <div className="sidebar-title">DIRECTORIES</div>
          <div className="folder-tree">
            <div className={`folder-tree-node ${dirId === 'root' ? 'active' : ''}`} onClick={() => {
              setDirId('root');
              setFileId(null);
            }}>
              <FolderIcon /> ROOT
            </div>
            {fileSystem.children.filter(n => n.type === 'folder').map(folder => (
              <div key={folder.id} style={{ marginLeft: '12px' }}>
                <div className={`folder-tree-node ${dirId === folder.id ? 'active' : ''}`} onClick={() => {
                  setDirId(folder.id);
                  setFileId(null);
                }}>
                  <FolderIcon /> {folder.name}
                </div>
                {folder.children.filter(n => n.type === 'folder').map(sub => (
                  <div
                    key={sub.id}
                    className={`folder-tree-node ${dirId === sub.id ? 'active' : ''}`}
                    style={{ marginLeft: '12px' }}
                    onClick={() => {
                      setDirId(sub.id);
                      setFileId(null);
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
              <span>SSD STORAGE</span>
              <span>1.2 TB / 4.0 TB</span>
            </div>
            <div className="meter-bar">
              <div className="meter-progress" style={{ width: '30%' }} />
            </div>
          </div>
        </div>

        <div className="fm-explorer">
          <div className="explorer-actions">
            <button className="explorer-btn glow-cyan" onClick={createFile}>+ NEW FILE</button>
            <button className="explorer-btn glow-cyan" onClick={createFolder}>+ NEW FOLDER</button>
          </div>

          <div className="items-grid">
            {visible.length === 0 ? (
              <div className="no-items">DIRECTORY IS EMPTY</div>
            ) : (
              visible.map((item) => (
                <div
                  key={item.id}
                  className={`grid-item ${item.id === fileId || (item.type === 'folder' && item.id === dirId) ? 'selected' : ''}`}
                  onClick={() => onItemClick(item)}
                  onDoubleClick={() => openItem(item)}
                >
                  <div className="item-icon-wrapper">
                    {item.type === 'folder' ? <FolderGridIcon /> : <FileGridIcon />}
                  </div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta-line">
                    {item.type === 'folder' ? 'FOLDER' : item.size}
                  </div>
                  <button className="item-delete-btn" onClick={(event) => deleteItem(item.id, event)}>×</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* file metadata preview panel */}
        <div className="fm-preview-pane">
          <div className="sidebar-title">FILE META</div>
          {selectedFile ? (
            <div className="fm-preview-details">
              <div className="fm-info-row">
                <span className="fm-info-label">FILENAME</span>
                <span className="fm-info-value glow-cyan">{selectedFile.name}</span>
              </div>
              <div className="fm-info-row">
                <span className="fm-info-label">FILE SIZE</span>
                <span className="fm-info-value">{selectedFile.size}</span>
              </div>
              <div className="fm-info-row">
                <span className="fm-info-label">DATATYPE</span>
                <span className="fm-info-value glow-orange">{selectedFile.mime}</span>
              </div>
              <div className="preview-content-box">
                <div className="preview-content-title">CONTENT PREVIEW:</div>
                <pre className="preview-content-text">{selectedFile.content}</pre>
              </div>
              <button className="fm-action-btn glow-cyan" onClick={() => openItem(selectedFile)}>
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
