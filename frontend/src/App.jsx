import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Signup from './Signup';
import Login from './Login';
import EntrepreneurDashboard from './EntrepreneurDashboard';
import CreateIdea from './CreateIdea';
import FounderProfile from './FounderProfile';
import InvestorDashboard from './InvestorDashboard';
import InvestorProfile from './InvestorProfile';
import AdvisorDashboard from './AdvisorDashboard';
import Marketplace from './Marketplace';
import AdvisorProfile from './AdvisorProfile';
import AdminDashboard from './AdminDashboard';
import MyMentees from './MyMentees';
import AdvisorSettings from './AdvisorSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<EntrepreneurDashboard />} />
        <Route path="/create-idea" element={<CreateIdea />} />
        <Route path="/profile" element={<FounderProfile />} />
        <Route path="/investor" element={<InvestorDashboard />} />
        <Route path="/investor-profile" element={<InvestorProfile />} />
        <Route path="/advisor" element={<AdvisorDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/advisor-profile" element={<AdvisorProfile />} />
        <Route path="/advisor-profile/:id" element={<AdvisorProfile />} />
        <Route path="/my-mentees" element={<MyMentees />} />
        <Route path="/advisor-settings" element={<AdvisorSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
