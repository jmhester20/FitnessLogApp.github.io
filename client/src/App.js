// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import CalendarPage    from './pages/CalendarPage';
import DateWorkoutPage from './pages/DateWorkoutPage';

function App() {
  // keep token in React state so route-guards update immediately
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <BrowserRouter>
        <Routes>
          {/* 1) If no token, always show login/register */}
          <Route
            path="/login"
            element={
              token 
                ? <Navigate to="/dashboard" replace />
                : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              token 
                ? <Navigate to="/dashboard" replace />
                : <RegisterPage />
            }
          />

          {/* 2) Protected calendar dashboard */}
          <Route
            path="/dashboard"
            element={
              token 
                ? <CalendarPage />
                : <Navigate to="/login" replace />
            }
          />

          {/* 3) Protected per-date workout-log page */}
          <Route
            path="/workouts/:date"
            element={
              token 
                ? <DateWorkoutPage />
                : <Navigate to="/login" replace />
            }
          />

          {/* 4) Catch-all "/" goes to dashboard or login */}
          <Route
            path="/"
            element={
              <Navigate to={token ? "/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
