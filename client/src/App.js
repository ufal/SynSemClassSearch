import React, { useEffect, useState } from "react";
import axios from 'axios';
import SearchForm from "./components/SearchForm";
import Layout from "./components/Layout";
import './App.css'
import 'font-awesome/css/font-awesome.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Contact from "./components/Contact";
import Statistics from "./components/Statistics";

// import { Router } from "express";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Router>
    <Layout>
      <ToastContainer /> 
      <div className="main-content">
        <Routes>
          <Route path={`${process.env.PUBLIC_URL}/`} element={<SearchForm />} />
          <Route path={`${process.env.PUBLIC_URL}/statistics`} element={<Statistics />} />
        </Routes>
      </div>
      <Contact/>
    </Layout>    
  </Router>
  )
}

export default App