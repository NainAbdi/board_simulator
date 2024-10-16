import React, { useState, useEffect } from 'react';
import Pad from './Pad';

// Add type of instance for the array
type PadInstance = {
    id: number;          // Unique ID for each pad
    position: { x: number; y: number }; // Position of the pad
    size: { width: number; height: number }; // Size of the pad
    maxPorts: number;
};

const PadManager = () => {
    const [instances, setInstances] = useState<PadInstance[]>([]); // State for Pad instances
  const [currentTrace, setCurrentTrace] = useState<{ points: { x: number; y: number }[] } | null>(null);
  const [traces, setTraces] = useState<{ points: { x: number; y: number }[] }[]>([]);
    const [deleteIndex, setDeleteIndex] = useState<number | ''>(''); // State for the delete index

     // Function to delete an instance based on the index
    const deleteInstance = () => {
        const index = typeof deleteIndex === 'number' ? deleteIndex : parseInt(deleteIndex as string);
        if (!isNaN(index) && index >= 0 && index < instances.length) {
          setInstances(instances.filter((_, i) => i !== index));
        }
        // Clear the input field after deletion
        setDeleteIndex('');
      };
    const addInstance = () => {
        const newInstance: PadInstance = {
            id: instances.length, // Assign a unique ID
            position: { x: 100, y: 100 }, // Default starting position
            size: { width: 100, height: 100 }, // Default size
            maxPorts: 6, // Default maximum ports
        };
        setInstances([...instances, newInstance]); // Add the new instance
    };

  const handleStartTrace = (startPoint: { x: number; y: number }) => {
    setCurrentTrace({ points: [startPoint] });
  };

  const handleContinueTrace = (point: { x: number; y: number }) => {
    if (currentTrace) {
      setCurrentTrace({ points: [...currentTrace.points, point] });
    }
  };


  const handleEndTrace = (endPoint: { x: number; y: number }) => {
    if (currentTrace) {
      setTraces([...traces, { points: [...currentTrace.points, endPoint] }]);
      setCurrentTrace(null);
    }
  };

  // Add event listener for clicks to add new line segments while tracing
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (currentTrace) {
        const svgElement = document.querySelector('.trace-layer') as SVGElement;
        if (!svgElement) return;

        const rect = svgElement.getBoundingClientRect();
        const newPoint = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        handleContinueTrace(newPoint);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [currentTrace]);
    return (
        <div>
            <button onClick={addInstance}>Add Instance</button>
          <svg className="trace-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {traces.map((trace, index) => (
              <polyline
                key={index}
                points={trace.points.map(p => `${p.x},${p.y}`).join(' ')}
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
            ))}
            {currentTrace && (
              <polyline
                points={currentTrace.points.map(p => `${p.x},${p.y}`).join(' ')}
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
            )}
          </svg>
          
            <div>
                <input
                  type="number"
                  value={deleteIndex}
                  onChange={(e) => setDeleteIndex(e.target.value ? parseInt(e.target.value) : '')} // Convert to number or set to empty string
                  placeholder="Enter index to delete"
                />
                <button onClick={deleteInstance}>Delete Instance</button>
              </div>
            
            {instances.map((instance, index) => (
            <Pad
                key={instance.id}
                position={instance.position}
                size={instance.size}
                maxPorts={instance.maxPorts}
              onStartTrace={handleStartTrace}
              onEndTrace={handleEndTrace}
            />
            ))}
        </div>
    );
};

export default PadManager;