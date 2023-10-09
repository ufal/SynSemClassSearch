import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CommonHeader from './CommonHeader';
import CommonFooter from './CommonFooter';


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
