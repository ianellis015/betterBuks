import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import Analyze from './Pages/Analysis.jsx';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze/:ticker" element={<Analyze />} />
      </Routes>
    </Router>
  )
}

export default App
