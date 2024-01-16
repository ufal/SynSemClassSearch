import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CommonHeader from './CommonHeader';
import CommonFooter from './CommonFooter';

// This component wraps the main content of the application, providing a consistent layout structure by including common headers and footers.
const Layout = ({ children }) => {
    return (
        <>
        <CommonHeader />
        <main>{children}</main>
        <CommonFooter />
        </>
    );
};

export default Layout;
