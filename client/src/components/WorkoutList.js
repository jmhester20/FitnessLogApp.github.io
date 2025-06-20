// client/src/components/WorkoutList.js

import React from 'react';

export default function WorkoutList({ workouts, onDelete }) {
  return (
    <table className="workout-list-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Workout</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((w, i) => (
          <tr key={w._id}>
            <td>{i + 1}</td>
            <td>
              {/* main text */}
              <div className="workout-text">
                {w.exercise}
                {' '}
                {w.time ? `— ${w.time} min` : `— ${w.sets}×${w.reps}`}
              </div>
              {/* nested weights if any */}
              {w.weights && w.weights.length > 0 && (
                <table className="log-weights-table nested">
                  <tbody>
                    <tr>
                      {w.weights.map((wt, idx) => (
                        <td key={idx}>Set {idx + 1}</td>
                      ))}
                    </tr>
                    <tr>
                      {w.weights.map((wt, idx) => (
                        <td key={idx}>{wt}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}
              {/* ← NEW: render notes */}
              {w.notes && (
                <p className="workout-notes">
                  <strong>Notes:</strong> {w.notes}
                </p>
              )}
            </td>
            <td>
              <button
                className="delete-btn"
                onClick={() => onDelete(w._id)}
              >Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
