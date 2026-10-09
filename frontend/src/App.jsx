import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Signup from './Signup';
import Login from './Login';
import EntrepreneurDashboard from './EntrepreneurDashboard';
import CreateIdea from './CreateIdea';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<EntrepreneurDashboard />} />
        <Route path="/create-idea" element={<CreateIdea />} />
      </Routes>
    </Router>
  );
}

export default App;
