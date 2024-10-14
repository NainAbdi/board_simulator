import React, { useState } from 'react';
import '../styles/DraggableResizableSquare.css'; // Create a CSS file for styles

const DraggableResizableSquare = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isResizing) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      setSize({
        width: Math.max(50, e.clientX - position.x), // Prevent size from becoming too small
        height: Math.max(50, e.clientY - position.y),
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', handleResizeMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleResizeMouseMove);
    };
  }, [isDragging, isResizing]);

  return (
    <div>
      <div
        className="draggable-square"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="resizer"
          onMouseDown={handleResizeMouseDown}
        />
      </div>
    </div>
  );
};

export default DraggableResizableSquare;