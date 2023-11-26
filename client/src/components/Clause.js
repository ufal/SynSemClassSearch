import React, { useState } from 'react';
import Role from './Role';
import './styles/Clause.css';
import Select from 'react-select';

const Clause = ({ id, roles, onAddRole, onRemoveRole, removeClause, isLastClause, selectOptions }) => {

    const [selectedRole, setSelectedRole] = useState(null);
    
    const handleAddRole = (selectedRole) => {
        if (selectedRole) {
            onAddRole(id, selectedRole.value); // Add the role
            setSelectedRole(null); // Reset the selected role
        }
    };

    return (
        <div className="clause">
            <div className="clause-wrapper">
                <div className="brackets">
                    <div className="bracket bracket-opening">(</div>
                    <div className="roles-container">
                        {roles.map((role, index) => (
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
                
                {/* Select Component for Role Addition */}
                <div className="role-selector-container">
                    <Select
                        className="role-selector"
                        value={selectedRole}
                        options={selectOptions}
                        onChange={handleAddRole}
                        isSearchable={true}
                        placeholder="Add Role To Clause"
                    />
                </div>
            </div>
    
            {/* AND Display Logic */}
            {!isLastClause && (
                <div className="and-container">AND</div>
            )}
        </div>
    );
};

export default Clause;
