// client/src/pages/RegisterPage.js
import React from 'react';
import AuthForm from '../components/AuthForm';
import './AuthPage.css';    

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <AuthForm mode="register" />
    </div>
  );
}
