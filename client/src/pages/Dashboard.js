// client/src/pages/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import WorkoutList from '../components/WorkoutList';
import WorkoutForm from '../components/WorkoutForm';
import ProgressChart from '../components/ProgressChart';
import { AuthContext } from '../AuthContext';

export default function Dashboard() {
  // Local state for workouts
  const [workouts, setWorkouts] = useState([]);
  // Context for auth so we can clear token on logout
  const { setToken } = useContext(AuthContext);

  // Fetch workouts from the server
  const loadWorkouts = async () => {
    try {
      const res = await api.get('/workouts/');
      setWorkouts(res.data);
    } catch (e) {
      console.error('Failed to load workouts', e);
    }
  };

  // Initial load
  useEffect(() => {
    loadWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logout handler clears context and storage
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={handleLogout}>Log Out</button>

      <h2>Your Workouts</h2>
      <WorkoutList workouts={workouts} onDeleted={loadWorkouts} />

      <h3>Add Workout</h3>
      <WorkoutForm onAdded={loadWorkouts} />

      <h3>Progress Chart</h3>
      <ProgressChart workouts={workouts} />
    </div>
  );
}
