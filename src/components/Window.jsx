import React, { useState, useEffect } from 'react';
import '../css/window.css';

export default function Window({ title, children, onClose, defaultPos }) {
  const [position, setPosition] = useState(defaultPos || { x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);

  const handleMouseDown = (e) => {
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
        // If positioned from the right, convert back to X for dragging, or just update right
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 400); // Wait for exit animation
  };

  const style = {
    top: `${position.y}px`,
    left: position.right === undefined ? `${position.x}px` : undefined,
    right: position.right !== undefined ? `${position.right}px` : undefined,
  };

  return (
    <div className={`holo-window ${isClosing ? 'closing' : 'opening'}`} style={style}>
      <div className="holo-window-header" onMouseDown={handleMouseDown}>
        <div className="holo-title">{title}</div>
        <div className="holo-close" onClick={handleClose}>[X]</div>
      </div>
      <div className="holo-window-content">
        {children}
      </div>
    </div>
  );
}
