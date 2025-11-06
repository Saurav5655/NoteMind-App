import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import { auth } from './services/firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
