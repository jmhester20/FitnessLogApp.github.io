// client/src/pages/CalendarPage.js
import React, { useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function CalendarPage() {
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);

    // Grab the username you saved at login
    const username = localStorage.getItem('username') || 'Your';

    const onDayClick = date => {
        const yyyyMmDd = date.toISOString().split('T')[0];
        navigate(`/workouts/${yyyyMmDd}`);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login', { replace: true });
    };

    return (
        <>
            <header className="full-header">
                <h2>{username}’s Workout Log</h2>
                <button onClick={handleLogout} className="logout-btn">
                    Log Out
                </button>
            </header>
            <p className="calendar-warning">If a log didn’t save, try logging out and back in to refresh.</p>

            <div className="calendar-card">
                <p className="calendar-subtitle">Choose date to log</p>
                <Calendar
                    className="calendar-component"
                    onClickDay={onDayClick}
                />
            </div>
        </>
    );
}
