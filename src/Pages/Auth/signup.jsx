import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RobotMascot from './RobotMascot';

import { signupUser } from '../../services/api';
import './auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const [focusState, setFocusState] = useState('idle'); // 'idle' | 'usernameFocused' | 'passwordFocused' | 'typing' | 'error' | 'success'
    
    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Password strength logic
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
    let strengthDisplay = '';
    let strengthColor = '';
    if (password.length > 0) {
        if (strengthScore <= 2) {
            strengthDisplay = '🔴 Weak';
            strengthColor = '#ff4d4d';
        } else if (strengthScore === 3 || strengthScore === 4) {
            strengthDisplay = '🟡 Normal';
            strengthColor = '#ffcc00';
        } else if (strengthScore === 5) {
            strengthDisplay = '🟢 Strong';
            strengthColor = '#00ff00';
        }
    }

    const handleFocus = (field) => {
        if (field === 'email') {
            setFocusState('usernameFocused');
        } else if (field === 'password' || field === 'confirmPassword') {
            setFocusState('passwordFocused');
        }
    };

    const handleBlur = () => {
        // Only reset to idle if we aren't displaying success/error
        if (focusState !== 'success' && focusState !== 'error') {
            setFocusState('idle');
        }
    };

    const handleTyping = (e, field) => {
        if (field === 'password' || field === 'confirmPassword') {
            setFocusState('typing');
            // Revert to pure focus state after short delay
            clearTimeout(window.typingTimer);
            window.typingTimer = setTimeout(() => {
                if (document.activeElement && document.activeElement.type === 'password') {
                    setFocusState('passwordFocused');
                } else {
                    setFocusState('idle');
                }
            }, 400);
        } else {
            setFocusState('usernameFocused');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            setFocusState('error');
            setTimeout(() => setFocusState('idle'), 2000);
            return;
        }

        try {
            await signupUser(email, password);
            setFocusState('success');
            setTimeout(() => {
                alert("Registration successful! Please login.");
                navigate('/login');
            }, 1500);
        } catch (err) {
            setFocusState('error');
            alert(err.message || "Registration failed!");
            setTimeout(() => setFocusState('idle'), 2000);
        }
    };

    return (
        <div className="cyber-auth-page">
            <RobotMascot currentState={focusState} />

            <div className="cyber-card">
                <div className="form-transition-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <h3 className="text-center mb-4" style={{ color: '#00F0FF', fontWeight: 'bold' }}>NEW OPERATIVE</h3>

                        <div className="cyber-input-group">
                            <label className="cyber-label">Secure Email</label>
                            <input
                                type="email"
                                className="cyber-input"
                                placeholder="agent@cyber.sec"
                                value={email}
                                onFocus={() => handleFocus('email')}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleTyping(e, 'email');
                                }}
                                required
                            />
                        </div>

                        <div className="cyber-input-group" style={{ marginBottom: password.length > 0 ? '0.5rem' : '1.25rem', transition: 'margin 0.3s ease' }}>
                            <label className="cyber-label">Password</label>
                            <input
                                type="password"
                                className="cyber-input"
                                placeholder="••••••••"
                                value={password}
                                onFocus={() => handleFocus('password')}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    handleTyping(e, 'password');
                                }}
                                required
                            />
                        </div>

                        {password.length > 0 && (
                            <div className="password-strength-container" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0 4px',
                                marginBottom: '1.25rem',
                                animation: 'slideIn 0.3s ease-out forwards'
                            }}>
                                <span style={{ fontSize: '0.75rem', color: '#8c9bb0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Strength</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: strengthColor, transition: 'color 0.3s ease' }}>{strengthDisplay}</span>
                            </div>
                        )}

                        <div className="cyber-input-group">
                            <label className="cyber-label">Confirm Password</label>
                            <input
                                type="password"
                                className="cyber-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onFocus={() => handleFocus('confirmPassword')}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    handleTyping(e, 'confirmPassword');
                                }}
                                required
                            />
                        </div>

                        <button type="submit" className="cyber-btn mt-4">ENROLL IN SYSTEM</button>

                        <div className="text-center mt-4">
                            <span style={{ color: '#8c9bb0' }}>Already registered? </span>
                            <button type="button" className="cyber-link fw-bold" onClick={() => navigate('/login')}>Return to Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
