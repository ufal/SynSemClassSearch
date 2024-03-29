import React from "react";
import './styles/Role.css';

// Role component for CNF roles' query construction
const Role = ({ role, onRemoveRole, isLastRole, showOR }) => {
    return (
        <div className="role">
            {role}
            <button type='button' onClick={onRemoveRole}>x</button>
            {!isLastRole && showOR && " OR "}
        </div>
    );
};

export default Role;
