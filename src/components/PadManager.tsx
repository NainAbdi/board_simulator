import React, { useState, useEffect } from 'react';
import Pad from './Pad';
import { components } from './Components'; // Import component properties

type PadInstance = {
    id: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    maxPorts: number;
    componentProps?: any; // Add this line to include componentProps
};

type Trace = {
    points: { x: number; y: number }[];
    resistance: number; // Resistance in ohms
};

const PadManager = () => {
    const [instances, setInstances] = useState<PadInstance[]>([]);
    const [currentTrace, setCurrentTrace] = useState<Trace | null>(null);
    const [traces, setTraces] = useState<Trace[]>([]);
    const [deleteIndex, setDeleteIndex] = useState<number | ''>('');
    const [hoveredResistance, setHoveredResistance] = useState<number |        null>(null);

    
    const deleteInstance = () => {
        const index = typeof deleteIndex === 'number' ? deleteIndex : parseInt(deleteIndex as string);
        if (!isNaN(index) && index >= 0 && index < instances.length) {
            setInstances(instances.filter((_, i) => i !== index));
        }
        setDeleteIndex('');
    };

    const addInstance = () => {

        const componentType = prompt("Enter component type (e.g., resistor, capacitor):");
        const componentProps = components[componentType as keyof typeof components];

        const newInstance: PadInstance = {
            id: instances.length,
            position: { x: 100, y: 100 },
            size: { width: 100, height: 100 },
            maxPorts: 6,
            componentProps: componentProps, // Add this line to set the component properties
        };
        setInstances([...instances, newInstance]);
    };
    const handleStartTrace = (startPoint: { x: number; y: number }) => {
        setCurrentTrace({ points: [startPoint], resistance: 0 }); // 0 ohms for an ideal wire
    };

    const handleContinueTrace = (point: { x: number; y: number }) => {
        if (currentTrace) {
            setCurrentTrace({ points: [...currentTrace.points, point], resistance: currentTrace.resistance });
        }
    };

    const handleEndTrace = (endPoint: { x: number; y: number }) => {
        if (currentTrace) {
            const newTrace: Trace = {
                points: [...currentTrace.points, endPoint],
                resistance: 0 // Default resistance
            };
            setTraces([...traces, newTrace]);
            setCurrentTrace(null);
        }
    };

    const handleTraceClick = (index: number) => {
        const confirmDelete = window.confirm("Would you like to delete this trace?");
        if (confirmDelete) {
            setTraces(traces.filter((_, i) => i !== index));
        }
    };

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

    // Detect hovering over traces and show resistance value
    const handleMouseMove = (e: MouseEvent) => {
        const hoverPoint = { x: e.clientX, y: e.clientY };
        let foundResistance = null;
        for (let trace of traces) {
            for (let point of trace.points) {
                const distance = Math.sqrt(
                    Math.pow(point.x - hoverPoint.x, 2) + Math.pow(point.y - hoverPoint.y, 2)
                );
                if (distance < 10) { // Adjust hover detection threshold as needed
                    foundResistance = trace.resistance;
                    break;
                }
            }
        }
        setHoveredResistance(foundResistance);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [traces]);


    return (
        <div>
            <button onClick={addInstance}>Add Instance</button>
            <svg
                className="trace-layer"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
                {traces.map((trace, index) => (
                    <polyline
                        key={index}
                        points={trace.points.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke="black"
                        strokeWidth="2"
                        fill="none"
                        onClick={() => handleTraceClick(index)}
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


            {hoveredResistance !== null && (
                <div className="tooltip" style={{ position: 'absolute', left: 0, top: 0 }}>
                    Resistance: {hoveredResistance.toFixed(2)} Ω
                </div>
            )}


            <div>
                <input
                    type="number"
                    value={deleteIndex}
                    onChange={(e) => setDeleteIndex(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="Enter index to delete"
                />
                <button onClick={deleteInstance}>Delete Instance</button>
            </div>

            {instances.map((instance) => (
                <Pad
                    key={instance.id}
                    position={instance.position}
                    size={instance.size}
                    maxPorts={instance.maxPorts}
                    onStartTrace={(startPoint)                                                 =>handleStartTrace(startPoint)} 
                    onEndTrace={handleEndTrace}
                    componentProperties={instance.componentProps} // Pass properties to Pad
                />
            ))}
        </div>
    );
};

export default PadManager;
