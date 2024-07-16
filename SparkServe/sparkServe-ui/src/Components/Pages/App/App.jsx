import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import WelcomePage from "../WelcomePage/WelcomePage"
import UserRegistration from "../UserRegistration/UserRegistration"
import PageRoutes from '../../../Router/PageRoutes';

function App() {
  return (
//     <>
//       <WelcomePage/>
//       <UserRegistration/>
      
//     </>
      <Router>
      <PageRoutes />
    </Router>
  );
}

export default App;