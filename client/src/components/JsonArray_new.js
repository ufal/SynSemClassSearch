import React, { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/JsonArray.css';
import './styles/JsonTree.css'; 
import engIcon from './icons/english-flag.png';
import cesIcon from './icons/czech-flag.png';
import deuIcon from './icons/german-flag.png';
import spaIcon from './icons/spanish-flag.png';
import { useLocation } from 'react-router-dom';

<link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" 
    integrity="sha384-DyZuuL25t9l0CUcjz78Y0ByJAX+Uq+8FjI/6Bz7Ry6I5Pm3eK9FJzLt3f8BJ4Y3w" 
    crossorigin="anonymous"
    />


// Function to get flag image based on language code
function getFlag(lang) {
    switch (lang) {
        case "eng":
            return engIcon;
        case "ces":
            return cesIcon;
        case "deu":
            return deuIcon;
        case "spa":
            return spaIcon
        default:
            return null;
    }
}

// Main component to render JSON data in an accordion format
function JsonArray({ data, currentPage, onFetchClassMembers, onFillRolesInQuery, version }) {
    const mobileIndent = window.innerWidth <= 768;
    // const [expandedItems, setExpandedItems] = useState([]);

    // State for tracking expanded items and members in the accordion
    const [expandedItems, setExpandedItems] = useState([]);
    const [expandedMembers, setExpandedMembers] = useState([]);
    const [tooltipIndex, setTooltipIndex] = React.useState(-1);

    // Function to toggle the expansion of accordion items
    const toggleExpand = (index, isMember) => {
        if(isMember) {
            const newExpandedMembers = [...expandedMembers];
            const currentIndex = newExpandedMembers.indexOf(index);
            if (currentIndex !== -1) {
            newExpandedMembers.splice(currentIndex, 1);
            } else {
            newExpandedMembers.push(index);
            }
            setExpandedMembers(newExpandedMembers);
        } else {
            const newExpandedItems = [...expandedItems];
            const currentIndex = newExpandedItems.indexOf(index);
            if (currentIndex !== -1) {
            newExpandedItems.splice(currentIndex, 1);
            } else {
            newExpandedItems.push(index);
            }
            setExpandedItems(newExpandedItems);
        }
        }

    // useEffect(() => {
    //     setExpandedItems([]);
    // }, [data]);

    // Reset expanded items when currentPage changes
    useEffect(() => {
        setExpandedItems([]);
    }, [currentPage]);
    
    // Function to copy text to clipboard and show toast notification
    const copyToClipboard = (str, event) => {
        event.stopPropagation(); // This will stop the event from bubbling up to the link click
        event.preventDefault(); // This will prevent the link from being followed

        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        copy(str);
        // alert(`Copied ${str} to clipboard.`);
        toast.success(`Copied ${str} to clipboard.`, {
            autoClose: 1000
        });
    };

    // Function to extract roles from a class item
    const getRoles = (classItem) => {
        let maparg = classItem.maparg.argpair;
        
        // Check if maparg is not an array
        if (!Array.isArray(maparg)) {
            // Convert to array
            maparg = [maparg];
        }
        
        const roles = maparg.reduce((rolesSet, arg) => {
            if (arg.argto && arg.argto['@idref']) {
            const role = arg.argto['@idref'].replace('vecrole', '');
            rolesSet.add(role);
            }
            return rolesSet;
        }, new Set());
        
        return [...roles]; // convert Set to Array for easier handling later
        };
    
    // JSX rendering for the accordion structure
    return (
        <div className="accordion">
            {data && Object.entries(data).map(([id, itemList], index) => (
                <div key={index} className="groupbyID">
                    <div className='classID-group'>
                    <a className="common-link topID" href={version === "synsemclass4.0" 
        ? `https://lindat.mff.cuni.cz/services/SynSemClass40/SynSemClass40.html?veclass=${id}`
        : `https://lindat.mff.cuni.cz/services/SynSemClass50/SynSemClass50.html?veclass=${id}`} target="_blank" rel="noopener noreferrer">
                        <span className="classID">
                            class ID: {id}
                            <span className="copy-icon-wrapper">
                            <i className="fa fa-copy copy-icon" onClick={(event) => copyToClipboard(id, event)}></i>
                            </span>
                        </span>
                    </a>
                    <button className='show-all' onClick={() => onFetchClassMembers(id)}>
                        Show all class members in the given class
                    </button>
                    </div>
                    <div 
                        className='roles-block-container' 
                        onClick={() => onFillRolesInQuery(itemList[0]["roles"])}
                    >
                        <div className='roles-block'>
                            <span className='roles-title'>roles:</span>
                            <span className='roles-list'>{itemList[0]["roles"].join(', ')}</span>
                            <span className='copy-action-text'> &lt;-- Click to copy into query</span>
                        </div>
                    </div>



                    {itemList.map((classItem, classIndex) => {
                        const itemKey = `${index}-${classIndex}`;
                        return (
                            <div key={itemKey} className="accordion-item">
                                <div className="accordion-header">
                                    <a className="common-link" href={version === "synsemclass4.0"? 
                                    `https://lindat.mff.cuni.cz/services/SynSemClass40/SynSemClass40.html?veclass=${id}`
                                    : `https://lindat.mff.cuni.cz/services/SynSemClass50/SynSemClass50.html?veclass=${id}`} target="_blank" rel="noopener noreferrer">
                                        <div className="flag">
                                        <img src={getFlag(classItem.classMembers[0]["@lang"])} alt="" />
                                        </div>
                                        <div className="class-common-id">
                                            <span className='classtext'>class: </span>
                                            <span>{classItem.commonClass}</span>
                                        </div>
                                    </a>
                                    <div className='classmember-block'>
                                        <span className='classmember-count'>{classItem.classMembers.length} class member(s): </span>
                                        {!expandedItems.includes(itemKey) && classItem.classMembers.slice(0, 2).map((member, i) => (
                                            <a key={i} className="item-info" href={version === "synsemclass4.0"
                                            ? `https://lindat.mff.cuni.cz/services/SynSemClass40/SynSemClass40.html?veclass=${id}#${member["@id"]}`
                                            : `https://lindat.mff.cuni.cz/services/SynSemClass50/SynSemClass50.html?veclass=${id}#${member["@id"]}`} target="_blank" rel="noopener noreferrer">
                                            <span className="classmember-item">{member["@lemma"]}</span>
                                            <span className='classmember-item idref'>
                                                ({member["@idref"]})
                                                <i className="fa fa-copy copy-icon" onClick={(event) => copyToClipboard(member["@idref"], event)}></i>
                                            </span>
                                            </a>
                                        ))}
                                        {!expandedItems.includes(itemKey) && classItem.classMembers.length > 2 && <span>...</span>}
                                    </div>
                                    <button
                                    className={`show-toggle-btn ${expandedItems.includes(itemKey) ? 'expanded' : ''}`}
                                    onClick={() => toggleExpand(itemKey)}
                                    >
                                    {expandedItems.includes(itemKey) ? 'Show Less' : 'Show More'}
                                    </button>
                                </div>
                                <div className={`accordion-content ${expandedItems.includes(itemKey) ? "expanded" : ""}`}>
                                    {classItem.classMembers.map((member, memberIndex) => {
                                        const memberKey = `${itemKey}-${memberIndex}`;
                                        return (
                                            <div key={memberKey} className="accordion-item classmember">
                                                <div className="accordion-header classmember">
                                                    <a className="item-info"  href={version === "synsemclass4.0"
                                            ? `https://lindat.mff.cuni.cz/services/SynSemClass40/SynSemClass40.html?veclass=${id}#${member["@id"]}`
                                            : `https://lindat.mff.cuni.cz/services/SynSemClass50/SynSemClass50.html?veclass=${id}#${member["@id"]}`} target="_blank" rel="noopener noreferrer">
                                                        <span className="classmember-item">{member["@lemma"]}</span>
                                                        <span className='classmember-item idref'>
                                                            ({member["@idref"]})
                                                            <i className="fa fa-copy copy-icon" onClick={(event) => copyToClipboard(member["@idref"], event)}></i>
                                                        </span>
                                                        <span className='classmember-item idref'>
                                                            ({member["@id"]})
                                                            <i className="fa fa-copy copy-icon" onClick={(event) => copyToClipboard(member["@id"], event)}></i>
                                                        </span>
                                                        <span className='classmember-item argpair'>
                                                        {(Array.isArray(member.maparg.argpair) ? member.maparg.argpair : [member.maparg.argpair]).map((argpair, pairIndex) => {
                                                            // Keep only uppercase characters
                                                            let argFrom;
                                                            if (argpair.argfrom['@idref'] === "#alt") {
                                                                argFrom = argpair.argfrom['@idref'] + "[" + argpair.argfrom.spec + "]";
                                                            } else {
                                                                argFrom = argpair.argfrom['@idref'].replace(/[^A-Z0-9]/g, '');
                                                            }
                                                            const argTo = argpair.argto['@idref'].replace(/vecrole/gi, '');
                                                            return `${argFrom} → ${argTo}`;
                                                        }).join(', ')}

                                                        </span>
                                                        
                                                    </a>
                                                    <i className={`fa ${expandedItems.includes(memberKey) ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} 
                                                        onClick={() => toggleExpand(memberKey)}
                                                    />
                                                </div>
                                                <div className={`accordion-content ${expandedItems.includes(memberKey) ? "expanded" : ""}`}>
                                                    {expandedItems.includes(memberKey) && <JsonTree data={member} depth={1} mobileIndent={mobileIndent} version={version} />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
    
    
    
}

const LINK_TYPES = {
    LINDAT: "lindat_link",
    COMMON_CLASS: "common_class_link",
    ID: "@id",
    LEMMA: "@lemma",
    LEXIDREF: "@lexidref",
    IDREF: "@idref",
    LUID: "@luid",
    FRAMENAME: "@framename",
    VERB: "@verb",
    SENSE: "@sense",
    WORD: "@word",
    SUBCLASS: "@subclass",
    CLASS: "@class",
    PREDICATE: "@predicate",
    FRAMEID: "@frameid",
    DIVID: "@divid",
    ENLEMMA: "@enlemma",
    CSLEMMA: "@cslemma"
};

// Convert a value to an array if it isn't already one
function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}

// Check if the value is an object
function isObject(value) {
    return value !== null && typeof value === "object";
}

function generateFramenetURL(linkAttributes) {
    const { "@framename": framename, "@luid": luid } = linkAttributes;

    if (luid) {
        // If @luid is not empty
        return `http://framenet2.icsi.berkeley.edu/fnReports/data/lu/lu${luid}.xml`;
    } else {
        // If @luid is empty
        return `https://framenet2.icsi.berkeley.edu/fnReports/data/frameIndex.xml?frame=${framename}`;
    }
}

function generateOntoNotesURL(linkAttributes) {
    const { "@verb": verb, "@sense": sense } = linkAttributes;

    if (sense) {
        // If @sense is not empty
        return `https://verbs.colorado.edu/html_groupings/${verb}-v.html#${sense}`;
    } else {
        // If @sense is empty
        return `https://verbs.colorado.edu/html_groupings/${verb}-v.html`;
    }
}

function generateVerbNetURL(linkAttributes) {
    const { "@subclass": subclass, "@class": class_ } = linkAttributes;

    if (subclass) {
        // If @subclass is not empty
        return `https://uvi.colorado.edu/verbnet/${subclass}`;
    } else {
        // If @subclass is empty
        return `https://uvi.colorado.edu/verbnet/${class_}`;
    }
}

function constructLink(type, value, rootData, version, isExtlexLinkItem = false, depth = 0, linkAttributes = {}) {
    if (depth === 1) {
        // Handle top-level properties
        switch (type) {
            case LINK_TYPES.ID:
                return version === "synsemclass4.0" 
                ? `https://lindat.mff.cuni.cz/services/SynSemClass40/SynSemClass40.html?veclass=${value.split('-')[0]}`
                : `https://lindat.mff.cuni.cz/services/SynSemClass50/SynSemClass50.html?veclass=${value.split('-')[0]}`;
            case LINK_TYPES.LEMMA:
                return version === "synsemclass4.0"
                ? `https://lindat.mff.cuni.cz/services/SynSemClass40/SynSemClass40.html?veclass=${rootData["@id"].split('-')[0]}#${rootData["@id"]}`
                : `https://lindat.mff.cuni.cz/services/SynSemClass50/SynSemClass50.html?veclass=${rootData["@id"].split('-')[0]}#${rootData["@id"]}`;
            case LINK_TYPES.IDREF:
                if (rootData["@lexidref"] === "pdtvallex" || rootData["@lexidref"] === "engvallex") {
                    return `${rootData["lexlink"]}verb=${rootData["@lemma"]}#${value.split("ID-")[1]}`;
                }
                if (rootData["@lexidref"] === "ancora") { // Spanish lex
                    let urlString = rootData["lexlink"];
                    urlString = urlString.replace("%26", "&");
                    let extlex = rootData.extlex;
                    if (!Array.isArray(extlex)) {
                        extlex = [extlex];
                    }
                    const ancoraItem = extlex.find(item => item["@idref"] === "ancora");
                    if (ancoraItem) {
                        const link = ancoraItem.links.link;
                        const file = link["@file"];
                        return `${urlString}${file}`
                    } 
                }
                if (rootData["@lexidref"] === "gup") {
                    let extlex = rootData.extlex;
                    if (!Array.isArray(extlex)) {
                        extlex = [extlex];
                    }
                    const gupItem = extlex.find(item => item["@idref"] === "gup");
                    if (gupItem) {
                        const link = gupItem.links.link;
                        const predicate = link["@predicate"];
                        const divid = link["@divid"];
                        return `${rootData["lexlink"]}${predicate}.html#${divid}`;
                    }
                }
                if (rootData["@lexidref"] === "valbu") {
                    let extlex = rootData.extlex;
                    if (!Array.isArray(extlex)) {
                        extlex = [extlex];
                    }
                    const gupItem = extlex.find(item => item["@idref"] === "valbu");
                    if (gupItem) {
                        const link = gupItem.links.link;
                        const id = link["@id"];
                        const sense = link["@sense"];
                        return `${rootData["lexlink"]}/${id}/${sense}`;
                    }
                }
            default:
                return value;
        }
    } else if (isExtlexLinkItem) {
        switch (type) {
            case LINK_TYPES.ID:
                if (linkAttributes.extlexIdRef === "valbu") {
                    return `https://grammis.ids-mannheim.de/verbs/view/${linkAttributes["@id"]}/${linkAttributes["@sense"]}`
                }
                break;

            case LINK_TYPES.LUID:
                if (linkAttributes.extlexIdRef === "fn" && linkAttributes["@luid"]) {
                    return generateFramenetURL(linkAttributes);
                }
                break;

            case LINK_TYPES.FRAMENAME:
                if (linkAttributes.extlexIdRef === "fn" && !linkAttributes["@luid"]) {
                    return generateFramenetURL(linkAttributes);
                }
                break;

            case LINK_TYPES.SENSE:
                if (linkAttributes.extlexIdRef === "on" && linkAttributes["@sense"]) {
                    return generateOntoNotesURL(linkAttributes);
                }
                break;

            case LINK_TYPES.VERB:
                if (linkAttributes.extlexIdRef === "on" && !linkAttributes["@sense"]) {
                    return generateOntoNotesURL(linkAttributes);
                }
                break;
            
            case LINK_TYPES.WORD:
                if (linkAttributes.extlexIdRef === "wn") {
                    const word = linkAttributes["@word"];
                    return `http://wordnetweb.princeton.edu/perl/webwn?o7=1&s=${word}`
                }
                break;

            case LINK_TYPES.SUBCLASS:
                if (linkAttributes.extlexIdRef === "vn" && linkAttributes["@subclass"]) {
                    return generateVerbNetURL(linkAttributes);
                }
                break;

            case LINK_TYPES.CLASS:
                if (linkAttributes.extlexIdRef === "vn" && !linkAttributes["@subclass"]) {
                    return generateVerbNetURL(linkAttributes);
                }
                break;

            case LINK_TYPES.PREDICATE:
                if (linkAttributes.extlexIdRef === "pb") {
                    const { "@predicate": predicate, "@filename": filename, "@rolesetid": rolesetid} = linkAttributes;
                    if (predicate && rolesetid && filename) {
                        return `https://propbank.github.io/v3.4.0/frames/${filename}.html#${predicate}.${rolesetid}`
                    }
                }
                if (linkAttributes.extlexIdRef === "gup") {
                    return `http://alanakbik.github.io/UniversalPropositions_German/${linkAttributes["@predicate"]}.html#${linkAttributes["@divid"]}`
                }
                break;
            
            case LINK_TYPES.FRAMEID:
                if (linkAttributes.extlexIdRef === "fnd") {
                    return `https://gsw.phil.hhu.de/framenet/frame?id=${linkAttributes["@frameid"]}`;
                }
                break;

            case LINK_TYPES.LEMMA:
                if (linkAttributes.extlexIdRef === "woxikon") {
                    return `https://synonyme.woxikon.de/synonyme/${linkAttributes["@lemma"]}.php`
                }
                if (linkAttributes.extlexIdRef === "valbu") {
                    return `https://grammis.ids-mannheim.de/verbs/view/${linkAttributes["@id"]}/${linkAttributes["@sense"]}`
                }
            case LINK_TYPES.IDREF:
                if (linkAttributes.extlexIdRef === "pdtvallex") {
                    return `${rootData["lexlink"]}verb=${rootData["@lemma"]}#${value}`;
                }
                if (linkAttributes.extlexIdRef === "engvallex") {
                    return `${rootData["lexlink"]}verb=${rootData["@lemma"]}#${value}`;
                }
                
                if (linkAttributes.extlexIdRef === "czengvallex") {
                    const { "@cslemma": cslemma, "@enlemma": enlemma, "@csid": csid, "@enid": enid } = linkAttributes;
                    if (cslemma && enlemma && csid && enid) {
                        return `https://lindat.mff.cuni.cz/services/CzEngVallex/CzEngVallex.html?vlanguage=cz&first_verb=${cslemma}&second_verb=${enlemma}#${csid}.${enid}`;
                    }
                }

                if (linkAttributes.extlexIdRef === "vallex") {
                    const { "@filename": filename, "@lemma": lemma, "@idref": idref} = linkAttributes;

                    const order = idref.match(/-(\d+)$/);
                    if (filename && lemma && idref && order[1]) {
                        return `https://ufal.mff.cuni.cz/vallex/4.0/#/lexeme/${filename}/${order[1]}`
                    }
                }

                break;
            
            case LINK_TYPES.ENLEMMA:
            case LINK_TYPES.CSLEMMA:
                if (linkAttributes.extlexIdRef === "czengvallex") {
                    const { "@cslemma": cslemma, "@enlemma": enlemma, "@csid": csid, "@enid": enid } = linkAttributes;
                    if (cslemma && enlemma && csid && enid) {
                        return `https://lindat.mff.cuni.cz/services/CzEngVallex/CzEngVallex.html?vlanguage=cz&first_verb=${cslemma}&second_verb=${enlemma}`;
                    }
                }

            default:
                return value;
        }
    }

    return value;  // Default to return original value
}

// Component to render hyperlinks based on type and value
function LinkRenderer({ type, value, rootData, version, isExtlexLinkItem = false, depth = 0, linkAttributes = {} }) {
    const href = constructLink(type, value, rootData, version, isExtlexLinkItem, depth, linkAttributes);
    return (
        href !== value ? 
        <a className="jsontree-link" href={href} target="_blank" rel="noopener noreferrer">
            {String(value)}
        </a> 
        : 
        <span>{value || ""}</span>
    );
}

// Recursive component to render nested JSON data
function JsonTree({ data, depth = 0, mobileIndent = false, rootData = data, version, extlexIdRef = null, linkAttributes = {} }) {

    // Function to render each value in the JSON tree
    function renderValue(key, value, rootData, depth, extlexIdRef = null, linkAttributes = {}) {
        return <LinkRenderer type={key} value={value} depth={depth} rootData={rootData} version={version} 
        isExtlexLinkItem={extlexIdRef === "pdtvallex" || extlexIdRef === "czengvallex" || 
        extlexIdRef === "engvallex" || extlexIdRef === "fn" || extlexIdRef === "on"
        || extlexIdRef === "wn" || extlexIdRef === "vn" || extlexIdRef === "pb" 
        || extlexIdRef === "fnd" || extlexIdRef === "woxikon" || extlexIdRef === "gup"
        || extlexIdRef === "valbu" || extlexIdRef === "vallex"} linkAttributes={linkAttributes} />;
    }    

    // console.log(`Current depth: ${depth}, extlexIdRef: ${extlexIdRef}`); // Logging depth and extlexIdRef status

    return (
        <ul className="tree">
            {Array.isArray(data) ?
                data.map((value, i) => (
                    <li key={i} style={{ marginLeft: mobileIndent ? depth * 10 : depth * 20 }}>
                        <span style={{ fontWeight: "bold" }}>[{i}]: </span>
                        <JsonTree data={value} depth={depth + 1} mobileIndent={mobileIndent} rootData={rootData} version={version} extlexIdRef={extlexIdRef} linkAttributes={linkAttributes} />
                    </li>
                )) :
                Object.entries(data).map(([key, value]) => (
                    key === "_id" ? null :
                    <li key={key} style={{ marginLeft: mobileIndent ? depth * 10 : depth * 20 }}>
                        <span style={{ fontWeight: "bold" }}>{key}: </span>
                        {key === "links" && value && value.link ? (
                            <li style={{ marginLeft: mobileIndent ? depth * 10 : depth * 20 }}>
                                <span style={{ fontWeight: "bold" }}>links:</span>
                                <ul className="tree">
                                    <li style={{ marginLeft: mobileIndent ? (depth + 1) * 10 : (depth + 1) * 20 }}>
                                        <span style={{ fontWeight: "bold" }}>link:</span>
                                    </li>
                                    {ensureArray(value.link).map((linkItem, index) => (
                                        <li key={index} style={{ marginLeft: mobileIndent ? (depth + 2) * 10 : (depth + 2) * 20 }}>
                                            <span style={{ fontWeight: "bold" }}>[{index}]: </span>
                                            <JsonTree 
                                                data={linkItem} 
                                                depth={depth + 3} 
                                                mobileIndent={mobileIndent} 
                                                rootData={rootData} 
                                                extlexIdRef={extlexIdRef} 
                                                linkAttributes={{...linkItem, extlexIdRef}}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ) :  key === "extlex" ? (
                            <>
                                {Array.isArray(value) ? 
                                    value.map((item, index) => (
                                        <JsonTree 
                                            key={index} 
                                            data={item} 
                                            depth={depth + 1} 
                                            mobileIndent={mobileIndent} 
                                            rootData={rootData}
                                            version={version}
                                            extlexIdRef={item["@idref"]} 
                                            linkAttributes={item}
                                        />
                                    ))
                                : 
                                    <JsonTree 
                                        data={value} 
                                        depth={depth + 1} 
                                        mobileIndent={mobileIndent} 
                                        rootData={rootData}
                                        version={version}
                                        extlexIdRef={value["@idref"]} 
                                        linkAttributes={value}
                                    />
                                }
                            </>
                        ) : (typeof value === "object" && value !== null) ? (
                            <JsonTree 
                                data={value} 
                                depth={depth + 1} 
                                mobileIndent={mobileIndent} 
                                rootData={rootData}
                                version={version}
                                extlexIdRef={extlexIdRef}
                                linkAttributes={linkAttributes}
                            />
                        ) : (
                            renderValue(key, value, rootData, depth, extlexIdRef, linkAttributes)
                        )}
                    </li>
                ))
            }
        </ul>
    );
}

export default JsonArray;