// client/src/pages/LoginPage.js
import React from 'react';
import AuthForm from '../components/AuthForm';
import './AuthPage.css';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthForm mode="login" />
    </div>
  );
}
