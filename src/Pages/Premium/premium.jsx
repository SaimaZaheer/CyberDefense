import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Layout/footer';
import './premium.css';
import { FaShieldAlt, FaGlobe, FaServer, FaCheck, FaTimes, FaLock, FaSignOutAlt } from 'react-icons/fa';

const Premium = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isPremium = user.isPremium === true;

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('user');
            localStorage.removeItem('userName');
            localStorage.removeItem('name');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
        }
    };

    return (
        <div className="premium-page">
            {/* Background Decorations */}
            <div className="cyber-grid-bg"></div>
            <div className="bg-shield-left"></div>
            <div className="bg-shield-right"></div>

            <div className="premium-container">
                <button className="db-logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt style={{ marginRight: '6px' }} /> Logout
                </button>

                {/* Header Section */}
                <header className="premium-header fade-down">
                    <h1 className="premium-title">
                        <FaShieldAlt className="title-icon" /> Premium Protection
                    </h1>
                    <p className="premium-subtitle fade-in">Unlock deep AI-powered threat intelligence and advanced analysis</p>
                </header>

                {/* Feature Cards */}
                <div className="features-grid">
                    {/* Card 1 */}
                    <div className="feature-card glass-panel stagger-1">
                        <div className="feature-icon-container">
                            <FaShieldAlt className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Deep AI Analysis</h3>
                        <p className="feature-description">
                            Get detailed explanations of why a message, URL, or website is dangerous using AI behavior analysis.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="feature-card glass-panel stagger-2">
                        <div className="feature-icon-container">
                            <FaServer className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Domain & Security Intelligence</h3>
                        <p className="feature-description">
                            View SSL status, domain age, hosting details, and hidden redirect chains for websites and URLs.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="feature-card glass-panel stagger-3">
                        <div className="feature-icon-container">
                            <FaGlobe className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Geo-Location Tracking</h3>
                        <p className="feature-description">
                            Identify where suspicious links and domains originate from worldwide.
                        </p>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="pricing-section">

                    {/* Free Plan */}
                    <div className="pricing-card free-plan glass-panel fade-recede">
                        <h3 className="plan-title">Free Plan</h3>
                        <div className="plan-price">Free</div>
                        <ul className="plan-features">
                            <li><FaCheck className="check-icon" /> Basic threat detection</li>
                            <li><FaCheck className="check-icon" /> Risk percentage</li>
                            <li><FaCheck className="check-icon" /> Simple safety advice</li>
                            <li className="disabled"><FaTimes className="cross-icon" /> Deep AI explanations</li>
                            <li className="disabled"><FaTimes className="cross-icon" /> Domain intelligence</li>
                            <li className="disabled"><FaTimes className="cross-icon" /> SSL certificate analysis</li>
                            <li className="disabled"><FaTimes className="cross-icon" /> Geo-location insights</li>
                            <li className="disabled"><FaTimes className="cross-icon" /> Advanced recommendations</li>
                        </ul>
                    </div>

                    {/* Premium Plan */}
                    <div className="pricing-card premium-plan glass-panel glowing-border floating-card">
                        <div className="recommended-badge shimmer-effect">RECOMMENDED</div>
                        <h3 className="plan-title">Premium Plan</h3>
                        <div className="plan-price">$9.99<span className="period">/mo</span></div>
                        <ul className="plan-features">
                            <li><FaCheck className="check-icon" /> Basic threat detection</li>
                            <li><FaCheck className="check-icon" /> Risk percentage</li>
                            <li><FaCheck className="check-icon" /> Simple safety advice</li>
                            <li><FaCheck className="check-icon" /> <strong>Deep AI explanations</strong></li>
                            <li><FaCheck className="check-icon" /> <strong>Domain intelligence</strong></li>
                            <li><FaCheck className="check-icon" /> <strong>SSL certificate analysis</strong></li>
                            <li><FaCheck className="check-icon" /> <strong>Geo-location insights</strong></li>
                            <li><FaCheck className="check-icon" /> <strong>Advanced recommendations</strong></li>
                        </ul>

                        <button 
                            className="upgrade-btn glowing-btn ripple-btn" 
                            onClick={() => navigate('/payment')} 
                            disabled={isPremium}
                            style={isPremium ? {background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', cursor: 'default', color: '#888'} : {}}
                        >
                            {isPremium ? <><FaCheck className="btn-icon" /> Already Premium</> : <><FaLock className="btn-icon pulse-icon" /> Upgrade to Premium</>}
                        </button>
                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Premium;
