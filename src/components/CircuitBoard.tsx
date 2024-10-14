import React from 'react';
import '../styles/CircuitBoard.css';

const CircuitBoard: React.FC = () => {
  return (
    <div className="circuit-board">
      <svg width="600" height="400" style={{ border: '2px solid black' }}>
        {/* Example of an outline or background shape for the circuit board */}
        <rect width="600" height="400" fill="lightgray" />
        {/* You can add more SVG elements here to represent components later */}
      </svg>
    </div>
  );
};

export default CircuitBoard;