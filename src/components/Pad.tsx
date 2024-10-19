import React, { useState } from 'react';
import '../styles/Pad.css';

type PadProps = {
    position: { x: number; y: number };
    size: { width: number; height: number };
    maxPorts: number;
    onStartTrace: (startPoint: { x: number; y: number }) => void;
    onEndTrace: (endPoint: { x: number; y: number }) => void;
    componentProperties?: Record<string, any>; // Properties to be displayed on hover
};

const Pad: React.FC<PadProps> = ({ position, size, maxPorts, onStartTrace, onEndTrace, componentProperties }) => {
    const [currentPosition, setPosition] = useState(position);
    const [currentSize, setSize] = useState(size);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setOffset({ x: e.clientX - currentPosition.x, y: e.clientY - currentPosition.y });
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
                width: Math.max(50, e.clientX - currentPosition.x),
                height: Math.max(50, e.clientY - currentPosition.y),
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

    const calculatePortPositions = () => {
        const positions = [];
        const { width, height } = currentSize;
        const perimeter = 2 * (width + height);
        const spacing = perimeter / maxPorts;

        for (let i = 0; i < maxPorts; i++) {
            const distance = i * spacing;
            let x = 0;
            let y = 0;

            if (distance < width) {
                x = distance;
                y = 0;
            } else if (distance < width + height) {
                x = width;
                y = distance - width;
            } else if (distance < 2 * width + height) {
                x = 2 * width + height - distance;
                y = height;
            } else {
                x = 0;
                y = perimeter - distance;
            }

            positions.push({ x, y });
        }

        return positions;
    };

    const portPositions = calculatePortPositions();

    return (
        <div
            className="draggable-square-wrapper"
            style={{
                position: 'absolute',
                left: currentPosition.x,
                top: currentPosition.y,
                width: currentSize.width,
                height: currentSize.height,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="draggable-square"
                style={{
                    width: currentSize.width,
                    height: currentSize.height,
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
                            left: port.x - 5,
                            top: port.y - 5,
                            cursor: 'pointer',
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            const confirmAction = window.confirm('Would you like to start or end a trace?');
                            if (confirmAction) {
                                onStartTrace({ x: currentPosition.x + port.x, y: currentPosition.y + port.y });
                            } else {
                                onEndTrace({ x: currentPosition.x + port.x, y: currentPosition.y + port.y });
                            }
                        }}
                    />
                ))}
                <div
                    className="resizer"
                    onMouseDown={handleResizeMouseDown}
                />
            </div>

            {/* Tooltip for displaying component properties */}
            {isTooltipVisible && (
                <div
                    className="tooltip"
                    style={{
                        position: 'absolute',
                        top: -60,
                        left: 0,
                        backgroundColor: 'lightgrey',
                        padding: '5px',
                        borderRadius: '4px',
                        zIndex: 10,
                    }}
                >
                    <strong>Component Properties:</strong>
                    <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                        {componentProperties &&
                            Object.entries(componentProperties).map(([key, value], idx) => (
                                <li key={idx}>
                                    {key}: {String(value)}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Pad;
