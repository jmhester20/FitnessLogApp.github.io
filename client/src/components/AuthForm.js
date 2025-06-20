// client/src/components/AuthForm.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../AuthContext';
import './AuthForm.css';

export default function AuthForm({ mode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]       = useState('');
  const navigate            = useNavigate();
  const { setToken }        = useContext(AuthContext);

  const handle = async () => {
    setErr('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const res  = await api.post(path, { username, password });
      console.log('login response:', res.data);

      if (mode === 'login') {
        // JWT may be under `token` or `access` depending on backend
        const jwt = res.data.token || res.data.access;
        if (!jwt) {
          throw new Error('No token field in login response');
        }
        setToken(jwt);
        localStorage.setItem('token', jwt);
        localStorage.setItem('username', username);
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (e) {
      setErr(
        e.response?.data?.message ||
        e.message ||
        'An unexpected error occurred'
      );
    }
  };

  return (
    <div className="auth-form-container">
      {/* App Title */}
      <h1 className="auth-form-title">Josh's Fitness Log App</h1>

      {/* Form Header */}
      <h2 className="auth-form-header">
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </h2>

      <input
        className="auth-form-input"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="auth-form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="auth-form-button" onClick={handle}>
        {mode === 'login' ? 'Log In' : 'Register'}
      </button>

      {err && <p style={{ color: 'red', textAlign: 'center' }}>{err}</p>}

      <div className="auth-form-footer">
        {mode === 'login' ? (
          <>Don’t have an account?
            <Link className="auth-form-link" to="/register">Create one</Link>
          </>
        ) : (
          <>Already have an account?
            <Link className="auth-form-link" to="/login">Sign in</Link>
          </>
        )}
      </div>
    </div>
  );
}
