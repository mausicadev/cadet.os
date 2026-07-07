import React, { useState, useEffect, useRef } from 'react';
import '../css/window.css';

export default function Window({
  id,
  title,
  children,
  onClose,
  defaultPos,
  focused,
  zIndex,
  slidOut,
  onFocus,
  onRestore,
  gridLayoutActive
}) {
  const [position, setPosition] = useState(defaultPos || { x: 50, y: 50 });
  const [size, setSize] = useState(() => {
    if (id === 'terminal') return { width: 600, height: 400 };
    if (id === 'files') return { width: 700, height: 420 };
    if (id === 'metrics') return { width: 600, height: 400 };
    if (id === 'tasks') return { width: 550, height: 400 };
    if (id === 'editor') return { width: 550, height: 350 };
    if (id === 'settings') return { width: 550, height: 350 };
    if (id === 'notes') return { width: 600, height: 380 };
    return { width: 600, height: 400 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [slideTransform, setSlideTransform] = useState('translate(0px, 0px)');
  const [animClass, setAnimClass] = useState('opening');
  
  const windowRef = useRef(null);

  // Keep default base sizes for initial sizing only; allow free-aspect resizing like native OS windows
  const defaultBaseSize = {
    terminal: { width: 600, height: 400 },
    files: { width: 700, height: 420 },
    metrics: { width: 600, height: 400 },
    tasks: { width: 550, height: 400 },
    editor: { width: 550, height: 350 },
    settings: { width: 550, height: 350 },
    notes: { width: 600, height: 380 }
  };

  // Clear the opening keyframe animation once it completes to prevent it from locking the transform
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimClass('');
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    });
  };

  const handleResizeMouseMove = (e) => {
    if (isResizing) {
      const dw = e.clientX - resizeStart.x;
      const dh = e.clientY - resizeStart.y;
      setSize({
        width: Math.max(300, Math.round(resizeStart.w + dw)),
        height: Math.max(200, Math.round(resizeStart.h + dh))
      });
    }
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
    } else {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, resizeStart]);

  const handleMouseDown = (e) => {
    if (slidOut || gridLayoutActive) return; // Prevent dragging while minimized or in grid mode
    onFocus && onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (position.right ? window.innerWidth - position.right : position.x),
      y: e.clientY - position.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      if (position.right) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
          right: undefined
        });
      } else {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Calculate slide translation for macOS-style hide desktop animation
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

      // Assign each window ID to a specific corner of the screen
      if (id === 'terminal') {
        // Top-Left corner
        tx = -(left + width - 35);
        ty = -(top + height - 35);
      } else if (id === 'tasks') {
        // Top-Right corner
        tx = screenW - left - 35;
        ty = -(top + height - 35);
      } else if (id === 'files') {
        // Bottom-Left corner
        tx = -(left + width - 35);
        ty = screenH - top - 35;
      } else if (id === 'metrics') {
        // Bottom-Right corner
        tx = screenW - left - 35;
        ty = screenH - top - 35;
      } else {
        // Dynamic fallback logic
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

      setSlideTransform(`translate(${tx}px, ${ty}px)`);
    } else {
      setSlideTransform('translate(0px, 0px)');
    }
  }, [slidOut, position, id, windowRef.current]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(onClose, 400); // Wait for exit animation
  };

  const handleWindowClick = (e) => {
    if (slidOut) {
      e.stopPropagation();
      onRestore && onRestore();
    } else {
      onFocus && onFocus();
    }
  };

  const style = {
    top: gridLayoutActive ? 'auto' : `${position.y}px`,
    left: gridLayoutActive ? 'auto' : (position.right === undefined ? `${position.x}px` : undefined),
    right: gridLayoutActive ? 'auto' : (position.right !== undefined ? `${position.right}px` : undefined),
    width: gridLayoutActive ? '100%' : `${size.width}px`,
    height: gridLayoutActive ? '100%' : `${size.height}px`,
    zIndex: zIndex || 10,
    transform: slideTransform,
  };

  // We no longer scale the inner content - let it reflow/scroll naturally like native windows

  return (
    <div
      ref={windowRef}
      className={`holo-window ${isClosing ? 'closing' : animClass} ${slidOut ? 'slid-out' : ''} ${focused ? 'focused' : ''}`}
      style={style}
      onClick={handleWindowClick}
    >
      {/* Visual cue overlay for slid-out state */}
      {slidOut && <div className="slid-out-overlay glow-orange" />}

      <div className="holo-window-header" onMouseDown={handleMouseDown}>
        <div className="holo-title">{title}</div>
        <div className="holo-close" onClick={handleClose}>[X]</div>
      </div>
      <div className="holo-window-content">
        {children}
      </div>

      {/* Resize Handle */}
      {!gridLayoutActive && !slidOut && (
        <div className="holo-resize-handle" onMouseDown={handleResizeMouseDown} />
      )}
    </div>
  );
}

