// client/src/components/WorkoutForm.js
import React, { useState } from 'react';
import api from '../utils/api';

export default function WorkoutForm({ onAdded, defaultDate }) {
  const [form, setForm] = useState({
    date: defaultDate || '',
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    unit: 'metric',
  });
  const [err, setErr] = useState('');

  const change = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setErr('');
    try {
      await api.post('/workouts/', form);
      setForm({ date: '', exercise: '', sets: '', reps: '', weight: '', unit: 'metric' });
      onAdded();
    } catch (e) {
      setErr(e.response?.data?.msg || 'Error');
    }
  };

  return (
    <div>
      {Object.entries(form).map(([key, val]) =>
        key !== 'unit' ? (
          <input
            key={key}
            name={key}
            type={
              key === 'date'
                ? 'date'
                : key === 'sets' || key === 'reps' || key === 'weight'
                  ? 'number'
                  : 'text'
            }
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={val}
            onChange={change}
          />
        ) : (
          <select name="unit" value={val} onChange={change} key="unit">
            <option value="metric">kg/cm</option>
            <option value="imperial">lbs/in</option>
          </select>
        )
      )}
      <button onClick={submit}>Add</button>
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </div>
  );
}
