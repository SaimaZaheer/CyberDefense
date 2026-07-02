import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RobotMascot from './RobotMascot';

import { loginUser } from '../../services/api';
import './auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [focusState, setFocusState] = useState('idle'); // 'idle' | 'usernameFocused' | 'passwordFocused' | 'typing' | 'error' | 'success'

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFocus = (field) => {
        if (field === 'username' || field === 'email') {
            setFocusState('usernameFocused');
        } else if (field === 'password') {
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
        if (field === 'password') {
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

        try {
            console.log("Attempting login...");

            const data = await loginUser(email, password);

            console.log("LOGIN RESPONSE:", data);

            // Make sure token exists
            if (!data.access_token) {
                throw new Error("Token missing from backend response");
            }

            // Store FULL backend response
            localStorage.setItem("user", JSON.stringify(data));

            console.log("Stored user:", localStorage.getItem("user"));

            setFocusState('success');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (err) {
            console.error("LOGIN ERROR:", err);

            setFocusState('error');

            alert(err.message || "Login failed!");

            setTimeout(() => {
                setFocusState('idle');
            }, 2000);
        }
    };
    return (
        <div className="cyber-auth-page">
            <RobotMascot currentState={focusState} />

            <div className="cyber-card">
                <div className="form-transition-container">
                    <form onSubmit={handleSubmit} className="auth-form" key="login">
                        <h3 className="text-center mb-4" style={{ color: '#00F0FF', fontWeight: 'bold' }}>SYSTEM LOGIN</h3>

                        <div className="cyber-input-group">
                            <label className="cyber-label">Access ID</label>
                            <input
                                type="text"
                                className="cyber-input"
                                placeholder="Email or Username"
                                value={email}
                                onFocus={() => handleFocus('username')}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleTyping(e, 'username');
                                }}
                                required
                            />
                        </div>

                        <div className="cyber-input-group">
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

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button type="button" className="cyber-link">Forgot Protocol?</button>
                        </div>

                        <button type="submit" className="cyber-btn">INITIALIZE CONNECTION</button>

                        <div className="text-center mt-4">
                            <span style={{ color: '#8c9bb0' }}>New User? </span>
                            <button type="button" className="cyber-link fw-bold" onClick={() => navigate('/signup')}>Register Here</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
