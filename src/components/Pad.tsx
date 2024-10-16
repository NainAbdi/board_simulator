import React, { useState } from 'react';
import '../styles/Pad.css'; // Create a CSS file for styles

type PadProps = {
    position: { x: number; y: number };
    size: { width: number; height: number };
    maxPorts: number; // New prop for maximum ports
    onStartTrace: (startPoint: { x: number; y: number }) => void;
    onEndTrace: (endPoint: { x: number; y: number }) => void;
};

const Pad: React.FC<PadProps> = ({ position, size, maxPorts, onStartTrace, onEndTrace }) => {
  const [currentposition, setPosition] = useState(position);
  const [currentsize, setSize] = useState(size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setOffset({ x: e.clientX - currentposition.x, y: e.clientY - currentposition.y });
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
        width: Math.max(50, e.clientX - currentposition.x), // Prevent size from becoming too small
        height: Math.max(50, e.clientY - currentposition.y),
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

  // Calculate positions of the ports along the pad's borders
  const calculatePortPositions = () => {
      const positions = [];
      const { width, height } = currentsize;
      const perimeter = 2 * (width + height); // Total perimeter of the pad
      const spacing = perimeter / maxPorts; // Distance between each port

      for (let i = 0; i < maxPorts; i++) {
          const distance = i * spacing;
          let x = 0;
          let y = 0;

          // Determine the port's position based on distance along the perimeter
          if (distance < width) {
              // Top edge
              x = distance;
              y = 0;
          } else if (distance < width + height) {
              // Right edge
              x = width;
              y = distance - width;
          } else if (distance < 2 * width + height) {
              // Bottom edge
              x = 2 * width + height - distance;
              y = height;
          } else {
              // Left edge
              x = 0;
              y = perimeter - distance;
          }

          positions.push({ x, y }); // Add calculated position to the array
      }

      return positions;
  };

  const portPositions = calculatePortPositions(); // Get the positions of the ports

  return (
    <div>
      <div
        className="draggable-square"
        style={{
          left: currentposition.x,
          top: currentposition.y,
          width: currentsize.width,
          height: currentsize.height,
        }}
        onMouseDown={handleMouseDown}
      >

        {portPositions.map((port, index) => (
          <div
            key={index}
            className="port"
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundColor: 'black',
              left: port.x - 5, // Offset to center the square
              top: port.y - 5,  // Offset to center the square
              cursor: 'pointer',
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartTrace({ x: currentposition.x + port.x, y: currentposition.y + port.y });
            }}
              />
            ))}
        <div
          className="resizer"
          onMouseDown={handleResizeMouseDown}
        />
      </div>
    </div>
  );
};

export default Pad;