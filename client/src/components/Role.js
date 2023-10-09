import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import './styles/Role.css';

const Role = ({ role, onRemoveRole, isLastRole, showOR }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'role',
        item: { role },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // State for opacity
    const [opacity, setOpacity] = useState(0);

    // Effect to change opacity after a small delay
    useEffect(() => {
        const timeout = setTimeout(() => setOpacity(1), 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div
            ref={drag}
            className="role"
            style={{ opacity: isDragging ? 0.5 : opacity }}
        >
            {role}
            <button type='button' onClick={onRemoveRole}>x</button>
            {!isLastRole && showOR && "OR"}
        </div>
    );
};

export default Role;
