import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import { auth } from './services/firebase';

// ThreeScene import removed

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    // Add a timeout to handle cases where Firebase auth takes too long
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds timeout

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <div className="text-white flex items-center justify-center h-screen bg-black">Loading interface...</div>;
  }

  return (
    <>
      {/* ThreeScene removed for simple design */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              user ? (
                <Layout user={user}>
                  <HomePage user={user} />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
