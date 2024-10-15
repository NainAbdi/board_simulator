import React, { useState } from 'react';
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

    const addInstance = () => {
        const newInstance: PadInstance = {
            id: instances.length, // Assign a unique ID
            position: { x: 100, y: 100 }, // Default starting position
            size: { width: 100, height: 100 }, // Default size
            maxPorts: 2, // Default maximum ports
        };
        setInstances([...instances, newInstance]); // Add the new instance
    };
    return (
        <div>
            <button onClick={addInstance}>Add Instance</button>
            {instances.map((instance, index) => (
            <Pad
                key={instance.id}
                position={instance.position}
                size={instance.size}
                maxPorts={instance.maxPorts}
            />
            ))}
        </div>
    );
};

export default PadManager;