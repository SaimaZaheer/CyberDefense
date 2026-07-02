import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="compact-cyber-footer">
      {/* Background Animated Elements */}
      <div className="hexagon-container">
        <div className="hex hex-1"></div>
        <div className="hex hex-2"></div>
        <div className="hex hex-3"></div>
      </div>

      <div className="glow-particles">
        <div className="gl-particle p1"></div>
        <div className="gl-particle p2"></div>
        <div className="gl-particle p3"></div>
        <div className="gl-particle p4"></div>
      </div>

      <div className="footer-content-row">
        <div className="footer-branding">
          <span className="brand-title">CYBER DEFENSE</span>
          <span className="brand-separator"> | </span>
          <span className="brand-subtitle">AI-Based Phishing Detection System</span>
        </div>

        <div className="footer-navigation">
          <Link to="/about" className="neon-link">About</Link>
          <span className="nav-separator">·</span>
          <Link to="/faq" className="neon-link">FAQ</Link>
          <span className="nav-separator">·</span>
          <Link to="/contact" className="neon-link">Contact</Link>
        </div>
      </div>

      {/* Top Border Glow */}
      <div className="neon-border-top"></div>
    </footer>
  );
};

export default Footer;
