import React, { useState, useEffect } from 'react';
import Pad from './Pad';

type PadInstance = {
    id: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    maxPorts: number;
};

const PadManager = () => {
    const [instances, setInstances] = useState<PadInstance[]>([]);
    const [currentTrace, setCurrentTrace] = useState<{ points: { x: number; y: number }[] } | null>(null);
    const [traces, setTraces] = useState<{ points: { x: number; y: number }[] }[]>([]);
    const [deleteIndex, setDeleteIndex] = useState<number | ''>('');

    const deleteInstance = () => {
        const index = typeof deleteIndex === 'number' ? deleteIndex : parseInt(deleteIndex as string);
        if (!isNaN(index) && index >= 0 && index < instances.length) {
            setInstances(instances.filter((_, i) => i !== index));
        }
        setDeleteIndex('');
    };

    const addInstance = () => {
        const newInstance: PadInstance = {
            id: instances.length,
            position: { x: 100, y: 100 },
            size: { width: 100, height: 100 },
            maxPorts: 6,
        };
        setInstances([...instances, newInstance]);
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
                    onStartTrace={handleStartTrace}
                    onEndTrace={handleEndTrace}
                />
            ))}
        </div>
    );
};

export default PadManager;
