import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaIdBadge, FaCheckCircle, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'User',
    email: 'user@cyberdefense.com',
    status: 'Active',
    role: 'Cyber Agent',
    isPremium: false
  });

  useEffect(() => {
    // Attempt to get from localStorage
    const userDataStr = localStorage.getItem('user');
    let storedName = '';
    let storedEmail = '';
    let isPremium = false;

    if (userDataStr) {
      try {
        const parsed = JSON.parse(userDataStr);
        if (parsed.user) {
          storedName = parsed.user.name;
          storedEmail = parsed.user.email;
          isPremium = parsed.user.is_premium;
        } else {
          storedName = parsed.name;
          storedEmail = parsed.email;
          isPremium = parsed.is_premium;
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    if (!storedName) storedName = localStorage.getItem('username') || localStorage.getItem('name');
    if (!storedEmail) storedEmail = localStorage.getItem('email');

    // Automatically derive a display name from the email if no meaningful name exists
    if (!storedName || storedName.trim().toLowerCase() === 'user' || storedName.trim() === '') {
       if (storedEmail) {
           const emailPrefix = storedEmail.split('@')[0];
           storedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
       }
    }

    setUser(prev => ({
      ...prev,
      name: storedName || prev.name,
      email: storedEmail || prev.email,
      isPremium: isPremium || false,
      role: isPremium ? 'Premium Agent' : 'Cyber Agent'
    }));
  }, []);

  const handleLogout = () => {
    // Clear user, token, and isLoggedIn status
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header-bg"></div>

      <div className="profile-content">
        <h1 className="profile-welcome">Welcome <span className="accent">{user.name}</span>!</h1>

        <div className="profile-card">
          <div className="profile-avatar-section">
            <FaUserCircle className="avatar-icon" />
            <h2 className="avatar-name">
              {user.name}
              {user.isPremium && <FaCrown className="premium-badge-icon" title="Premium User" />}
            </h2>
            <p className="avatar-role">{user.role}</p>
          </div>

          <div className="profile-details-section">
            <h3 className="section-title">Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <FaIdBadge className="info-icon" />
                <div className="info-text">
                  <span className="info-label">Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
              </div>
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="info-text">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>
              <div className="info-item">
                <FaCheckCircle className="info-icon status-icon" />
                <div className="info-text">
                  <span className="info-label">Account Status</span>
                  <span className="info-value status-active">{user.status}</span>
                </div>
              </div>
              <div className="info-item">
                <FaUserCircle className="info-icon" />
                <div className="info-text">
                  <span className="info-label">Role</span>
                  <span className="info-value">{user.role}</span>
                </div>
              </div>
            </div>
          </div>



          <div className="profile-actions">
            <button className="btn-logout" onClick={handleLogout}>
              <FaSignOutAlt className="btn-icon" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
