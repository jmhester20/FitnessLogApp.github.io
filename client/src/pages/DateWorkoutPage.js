// client/src/pages/DateWorkoutPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import WorkoutList from '../components/WorkoutList';
import './DateWorkoutPage.css';

export default function DateWorkoutPage() {
  const { date } = useParams();
  const savedNote = localStorage.getItem(`dateNotes-${date}`) || '';
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState(null);
  const [stage, setStage] = useState('details');
  const [entry, setEntry] = useState({
    exercise: '',
    time: '',
    sets: '',
    reps: '',
    weights: [],
    notes:    savedNote 
  });

  
 useEffect(() => {
    localStorage.setItem(`dateNotes-${date}`, entry.notes);
  }, [entry.notes, date]);

  const changeField = e =>
    setEntry(ent => ({ ...ent, [e.target.name]: e.target.value }));

  const goToWeights = () => {
    if (!entry.exercise || !entry.sets || !entry.reps)
      return alert('Enter exercise, sets & reps');
    setEntry(ent => ({ ...ent, weights: Array(parseInt(ent.sets, 10)).fill('') }));
    setStage('weights');
  };

  const changeWeight = (i, v) =>
    setEntry(ent => ({ ...ent, weights: ent.weights.map((w,j) => j===i?v:w) }));

  const saveWorkout = async () => {
    const payload = {
      date,
      exercise: entry.exercise,
      notes:    entry.notes
    };
    if (mode === 'time') {
      if (!entry.time) return alert('Enter time');
      payload.time = parseFloat(entry.time);
    } else {
      payload.sets    = parseInt(entry.sets, 10);
      payload.reps    = parseInt(entry.reps, 10);
      payload.weights = entry.weights.map(w => `${w} lbs`);
    }
    try {
      await api.post('/workouts/', payload);
      setShowForm(false);
      setMode(null);
      setStage('details');
      setEntry({ exercise:'', time:'', sets:'', reps:'', weights:[], notes:'' });
      fetchWorkouts();
    } catch {
      alert('Could not save workout.');
    }
  };

  const deleteWorkout = async id => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch {
      alert('Failed to delete workout.');
    }
  };

  const fetchWorkouts = () => {
    api.get(`/workouts/?date=${date}`)
      .then(res => setWorkouts(res.data.filter(w => w.date === date)))
      .catch(console.error);
  };
  useEffect(fetchWorkouts, [date]);

  // summary metrics
  const totalMinutes = workouts.filter(w => 'time' in w).reduce((s,w) => s + (parseFloat(w.time)||0), 0);
  const totalSets    = workouts.filter(w => 'sets' in w).reduce((s,w) => s + (parseInt(w.sets,10)||0), 0);
  const totalReps    = workouts
    .filter(w => 'sets' in w && 'reps' in w)
    .reduce((s,w) => s + ((parseInt(w.sets,10)||0)*(parseInt(w.reps,10)||0)), 0);

  return (
    <div className="date-page">
      <Link to="/dashboard" className="back-link">← Back to Calendar</Link>
      <h2>{date} Workout Log</h2>

      {/* SUMMARY METRICS */}
      <div className="summary-metrics">
        <div>Minutes worked out: <strong>{totalMinutes}</strong></div>
        <div>Total sets completed: <strong>{totalSets}</strong></div>
        <div>Total reps completed: <strong>{totalReps}</strong></div>
      </div>

      {/* NOTES BOX — always visible */}
      <div className="notes-container">
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          className="notes-area"
          placeholder="Any extra details..."
          value={entry.notes}
          onChange={changeField}
        />
      </div>

      {/* ADD WORKOUT BUTTON */}
      {!showForm && (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add Workout
        </button>
      )}

      {/* FORM CONTAINER */}
      <div className="form-container">
        {/* Mode chooser */}
        {showForm && mode === null && (
          <div className="form-section">
            <p>Log by:</p>
            <button className="mode-btn" onClick={() => setMode('time')}>Time (min)</button>
            <button className="mode-btn" onClick={() => setMode('sets')}>Sets/Reps</button>
            <button className="cancel-btn" onClick={() => {
              setShowForm(false);
              setMode(null);
              setStage('details');
              setEntry({ exercise:'', time:'', sets:'', reps:'', weights:[], notes:entry.notes });
            }}>Cancel</button>
          </div>
        )}

        {/* Time entry form */}
        {showForm && mode === 'time' && (
          <table className="entry-table">
            <thead>
              <tr><th>Workout</th><th>Time (min)</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    name="exercise"
                    value={entry.exercise}
                    onChange={changeField}
                    placeholder="Workout"
                  />
                </td>
                <td>
                  <input
                    name="time"
                    type="number"
                    value={entry.time}
                    onChange={changeField}
                    placeholder="Min"
                  />
                </td>
                <td>
                  <button className="save-btn" onClick={saveWorkout}>Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Sets/Reps entry form */}
        {showForm && mode === 'sets' && stage === 'details' && (
          <table className="entry-table">
            <thead>
              <tr><th>Workout</th><th>Sets</th><th>Reps</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    name="exercise"
                    value={entry.exercise}
                    onChange={changeField}
                    placeholder="Workout"
                  />
                </td>
                <td>
                  <input
                    name="sets"
                    type="number"
                    value={entry.sets}
                    onChange={changeField}
                    placeholder="Sets"
                  />
                </td>
                <td>
                  <input
                    name="reps"
                    type="number"
                    value={entry.reps}
                    onChange={changeField}
                    placeholder="Reps"
                  />
                </td>
                <td>
                  <button className="next-btn" onClick={goToWeights}>Next</button>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Weights entry form */}
        {showForm && mode === 'sets' && stage === 'weights' && (
          <table className="weights-table">
            <thead>
              <tr><th>Set</th><th>Weight (lbs)</th></tr>
            </thead>
            <tbody>
              {entry.weights.map((w,i) => (
                <tr key={i}>
                  <td>Set {i+1}</td>
                  <td>
                    <input
                      value={w}
                      onChange={e => changeWeight(i, e.target.value)}
                      placeholder="Weight"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" style={{ textAlign:'right' }}>
                  <button className="save-btn" onClick={saveWorkout}>Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* SAVED WORKOUTS */}
      {workouts.length > 0
        ? <WorkoutList workouts={workouts} onDelete={deleteWorkout} />
        : <p className="no-workouts">No workouts logged yet.</p>}
    </div>
  );
}
