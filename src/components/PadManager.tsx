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
    
    return (
        <div>
            <button onClick={addInstance}>Add Instance</button>


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
            />
            ))}
        </div>
    );
};

export default PadManager;