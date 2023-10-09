import React, { useEffect, useState } from 'react';

function CommonFooter() {
    const [html, setHtml] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/footer`)
        .then(response => response.text())
        .then(setHtml);
    }, []);

    if (html === null) {
        return null; // or a loading spinner
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

export default CommonFooter;
