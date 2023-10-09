import React, { useState } from 'react';

import './styles/JsonArray.css';
import './styles/JsonTree.css'; 
import engIcon from './icons/english-flag.png';
import cesIcon from './icons/czech-flag.png';
import deuIcon from './icons/german-flag.png';

function getFlag(lang) {
    switch (lang) {
        case "eng":
            return engIcon;
        case "ces":
            return cesIcon;
        case "deu":
            return deuIcon;
        default:
            return null;
    }
}

function JsonArray({ data }) {

    const mobileIndent = window.innerWidth <= 768;

    const [expandedItems, setExpandedItems] = useState([]);
    

    const toggleExpand = (index) => {
        setExpandedItems((prevState) =>
            prevState.includes(index)
                ? prevState.filter((i) => i !== index)
                : [...prevState, index]
        );
    };

    if (!Array.isArray(data)) {
        console.error('JsonArray: data prop is not an array', data);
        return null;
    }

    return (
        <div className="accordion">
            {data.map((item, index) => (
                <div key={index} className="accordion-item">
                    <div className="accordion-header">
                        <div className="header-content">
                        <div className="flag">
                            <img src={getFlag(item.classmembers.classmember['@lang'])} alt="" />
                        </div>
                        <div className="item-info">
                            <a href={item.classmembers.classmember.lindat_link} target="_blank" rel="noopener noreferrer">
                            <span className="lemma">{item.classmembers.classmember['@lemma']}</span>
                            <span className="id-subscript">({item.classmembers.classmember['@idref']}) ({item.classmembers.classmember['@id']})</span>
                            </a>
                        </div>
                        <a className="common-link" href={item.classmembers.classmember.common_class_link} target="_blank" rel="noopener noreferrer">
                            <span className="class-common-id">class: {item.classmembers.classmember.common_id}</span>
                            <span className="common-class">{item.classmembers.classmember.common_class}</span>
                        </a>
                        </div>
                        <i className={`fa ${expandedItems.includes(index) ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} 
                        onClick={() => toggleExpand(index)} />
                    </div>
                    <div className={`accordion-content ${expandedItems.includes(index) ? "expanded" : ""}`}>
                        <JsonTree data={item.classmembers.classmember} depth={1} mobileIndent={mobileIndent} />
                    </div>
                </div>
            ))}
        </div>
    );
    }

function JsonTree({ data, depth = 0, mobileIndent = false }) {
    if (typeof data !== 'object' || data === null) {
        // If the data is not an object or is null, just render the value
        return <div>{data == null ? '' : String(data)}</div>;
    }

    // If the data is an object or an array, render the keys and values
    return (
        <ul className="tree">
            {Array.isArray(data)
                ? data.map((value, i) => (
                        <li
                            key={i}
                            style={{
                                marginLeft: mobileIndent ? depth * 10 : depth * 20,
                            }}
                        >
                            <span style={{ fontWeight: "bold" }}>[{i}]: </span>
                            <JsonTree data={value} depth={depth + 1} mobileIndent={mobileIndent} />
                        </li>
                    ))
                : Object.entries(data).map(([key, value]) => (
                        key === "_id" ? null : // skip rendering if key is '_id'
                        <li
                            key={key}
                            style={{
                                marginLeft: mobileIndent ? depth * 10 : depth * 20,
                            }}
                        >
                            <span style={{ fontWeight: "bold" }}>{key}: </span>
                            {typeof value === "object" && value !== null ? (
                                <JsonTree data={value} depth={depth + 1} mobileIndent={mobileIndent} />
                            ) : (
                                key === "lindat_link" || key === "common_class_link" ? (
                                    <a href={String(value)} target="_blank" rel="noopener noreferrer">
                                        {String(value)}
                                    </a>
                                ) : (
                                    <span>{value == null ? "" : String(value)}</span>
                                )
                                
                            )}
                        </li>
                    ))}
        </ul>
    );
}

export default JsonArray;
