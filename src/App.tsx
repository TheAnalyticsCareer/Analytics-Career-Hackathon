import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AllChallenges from './pages/AllChallenges';
import MyChallenges from './pages/MyChallenges';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import ChallengeDetail from './pages/ChallengeDetail';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import AuthProvider from './contexts/AuthContext';
import ThemeProvider from './contexts/ThemeContext';
import DataProvider from './contexts/DataContext';
import Footer from './pages/Footer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Contact from './pages/Contact';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex flex-col">
              <Navbar />
              <main className="pt-16 flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/all-challenges" element={<AllChallenges />} />
                  <Route path="/my-challenges" element={<MyChallenges />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/challenge/:id" element={<ChallengeDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/refund" element={<Refund />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                }}
              />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;