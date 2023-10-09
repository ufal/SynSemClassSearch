import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Role from './Role';
import './styles/Clause.css';
import Select from 'react-select';

const MobileAddRole = ({ onAddRole, id, selectOptions }) => {
    const handleAddRoleMobile = (selectedRole) => {
        if (selectedRole) {
            onAddRole(id, selectedRole.value); // Note: passing selectedRole.value, not the whole object
        }
    };

    return (
        <div className='mobile-view'>
            <Select
                className="role-selector"
                options={selectOptions}
                onChange={handleAddRoleMobile}
                isSearchable={true}
                placeholder="Add Role To Clause"
            />
        </div>
    );
};


const Clause = ({ id, roles, onAddRole, onRemoveRole, removeClause, isLastClause, selectOptions}) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'role',
        drop: (item) => onAddRole(id, item.role),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
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
        <div ref={drop} 
            className={`clause ${isOver ? 'over' : ''} ${canDrop ? 'can-drop' : ''}`}
        >
            <div className="clause-wrapper">
                <div 
                    className={`brackets ${isOver ? 'over' : ''} ${canDrop ? 'can-drop' : ''}`}
                    style={{
                        opacity,
                        transform: isOver ? 'scale(1.1)' : 'scale(1)' 
                    }}
                >
                    <div className="bracket bracket-opening">(</div>
                    <div className="roles-container">
                        {roles && roles.map((role, index) => (
                            <Role 
                                key={index} 
                                role={role} 
                                onRemoveRole={() => onRemoveRole(id, role)} 
                                isLastRole={index === roles.length - 1}
                                showOR={true}
                            />
                        ))}
                    </div>
                    <div className="bracket bracket-closing">)</div>
                    <button type='button' onClick={removeClause}>x</button>
                </div>
                
                {/* Mobile Add Role */}
                <div className="mobile-view">
                    <MobileAddRole onAddRole={onAddRole} id={id} selectOptions={selectOptions} />
                </div>
            </div>
    
            {/* AND Display Logic */}
            {!isLastClause && (
                <>
                    <div className="desktop-and">AND</div>
                    <div className="mobile-and">AND</div>
                </>
            )}
        </div>
    );
    
};

export default Clause;
