import React from "react";
import './styles/Contact.css';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// copy the email address
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
    toast.success(`Copied ${str} to clipboard.`, {
        autoClose: 1000
    });
};

// Provides contact information and API guide link to use in the App.js as a separate flexible component
function Contact() {
    const email = "synsemclass@ufal.mff.cuni.cz"
    return (
        <div className="contact-info">
                    <p>
                        For inquiries or feedback, please contact{' '}
                        <span 
                            className="email" 
                            onClick={(event) => copyToClipboard(email, event)}>
                        {email}.
                        </span>
                    </p>
                    <p>
                        <a className='clear-link' href="https://ufal.mff.cuni.cz/synsemclass/synsemclass-search-tool" target="_blank" rel="noopener noreferrer">API guide</a>
                    </p>
            </div>
    );
}

export default Contact;
