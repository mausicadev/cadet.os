import React, { useState, useEffect, useRef } from 'react';
import '../css/window.css';

export default function Window({
  id,
  title,
  children,
  onClose,
  defaultPos,
  position: positionProp,
  size: sizeProp,
  onLayoutChange,
  focused,
  zIndex,
  slidOut,
  onFocus,
  onRestore
}) {
  const [position, setPosition] = useState(() => positionProp || defaultPos || { x: 50, y: 50 });
  const [size, setSize] = useState(() => {
    if (sizeProp) return sizeProp;
    if (id === 'terminal') return { width: 600, height: 400 };
    if (id === 'files') return { width: 700, height: 420 };
    if (id === 'metrics') return { width: 600, height: 400 };
    if (id === 'tasks') return { width: 550, height: 400 };
    if (id === 'editor') return { width: 550, height: 350 };
    if (id === 'settings') return { width: 650, height: 550 };
    if (id === 'notes') return { width: 600, height: 380 };
    return { width: 600, height: 400 };
  });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [closing, setClosing] = useState(false);
  const [slideTx, setSlideTx] = useState('translate(0px, 0px)');
  const [anim, setAnim] = useState('opening');
  
  const windowRef = useRef(null);

  useEffect(() => {
    if (positionProp) {
      setPosition(positionProp);
    }
  }, [positionProp?.x, positionProp?.y, positionProp?.right]);

  useEffect(() => {
    if (sizeProp) {
      setSize(sizeProp);
    }
  }, [sizeProp?.width, sizeProp?.height]);

  
  const baseSizes = {
    terminal: { width: 600, height: 400 },
    files: { width: 700, height: 420 },
    metrics: { width: 600, height: 400 },
    tasks: { width: 550, height: 400 },
    editor: { width: 550, height: 350 },
    settings: { width: 550, height: 350 },
    notes: { width: 600, height: 380 }
  };

  // animatie de deschidere fereastra
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnim('');
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const startResize = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    });
  };

  const onResizeMove = (e) => {
    if (resizing) {
      const dw = e.clientX - resizeStart.x;
      const dh = e.clientY - resizeStart.y;
      const nextSize = {
        width: Math.max(300, Math.round(resizeStart.w + dw)),
        height: Math.max(200, Math.round(resizeStart.h + dh))
      };
      setSize(nextSize);
      onLayoutChange?.({ position, size: nextSize });
    }
  };

  const stopResize = () => {
    setResizing(false);
  };

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', onResizeMove);
      window.addEventListener('mouseup', stopResize);
    } else {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', stopResize);
    }
    return () => {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [resizing, resizeStart]);

  const startDrag = (e) => {
    if (slidOut) return; 
    onFocus && onFocus();
    setDragging(true);
    setDragOffset({
      x: e.clientX - (position.right ? window.innerWidth - position.right : position.x),
      y: e.clientY - position.y
    });
  };

  const stopDrag = () => {
    setDragging(false);
  };

  const onDragMove = (e) => {
    if (dragging) {
      const nextPosition = position.right ? {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
        right: undefined
      } : {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      setPosition(nextPosition);
      onLayoutChange?.({ position: nextPosition, size });
    }
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', stopDrag);
    } else {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', stopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [dragging, dragOffset]);

  // calculam unde sa slide-uiasca fereastra cand minimizam
  useEffect(() => {
    if (slidOut && windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      const left = position.x;
      const top = position.y;
      const width = rect.width || 600;
      const height = rect.height || 400;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      let tx = 0;
      let ty = 0;

      // am pus 35px offset ca sa se vada un pic din fereastra minimizata la margini
      if (id === 'terminal') {
        tx = -(left + width - 35);
        ty = -(top + height - 35);
      } else if (id === 'tasks') {
        tx = screenW - left - 35;
        ty = -(top + height - 35);
      } else if (id === 'files') {
        tx = -(left + width - 35);
        ty = screenH - top - 35;
      } else if (id === 'metrics') {
        tx = screenW - left - 35;
        ty = screenH - top - 35;
      } else {
        if (left + width / 2 < screenW / 2) {
          tx = -(left + width - 35);
        } else {
          tx = screenW - left - 35;
        }
        if (top + height / 2 < screenH / 2) {
          ty = -(top + height - 35);
        } else {
          ty = screenH - top - 35;
        }
      }

      setSlideTx(`translate(${tx}px, ${ty}px)`);
    } else {
      setSlideTx('translate(0px, 0px)');
    }
  }, [slidOut, position, id, windowRef.current]);

  const doClose = (e) => {
    e.stopPropagation();
    setClosing(true);
    setTimeout(onClose, 400); 
  };

  const onWinClick = (e) => {
    if (slidOut) {
      e.stopPropagation();
      onRestore && onRestore();
    } else {
      onFocus && onFocus();
    }
  };

  const style = {
    top: `${position.y}px`,
    left: position.right === undefined ? `${position.x}px` : undefined,
    right: position.right !== undefined ? `${position.right}px` : undefined,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: zIndex || 10,
    transform: slideTx,
  };

  return (
    <div
      ref={windowRef}
      className={`holo-window ${closing ? 'closing' : anim} ${slidOut ? 'slid-out' : ''} ${focused ? 'focused' : ''}`}
      style={style}
      onClick={onWinClick}
    >
      {/* overlay cand e minimizat */}
      {slidOut && <div className="slid-out-overlay glow-orange" />}

      <div className="holo-window-header" onMouseDown={startDrag}>
        <div className="holo-title">{title}</div>
        <div className="holo-close" onClick={doClose}>[X]</div>
      </div>
      <div className="holo-window-content">
        {children}
      </div>

      {/* resize handle - doar in modul floating */}
      {!slidOut && (
        <div className="holo-resize-handle" onMouseDown={startResize} />
      )}
    </div>
  );
}

