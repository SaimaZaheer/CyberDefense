import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Layout/footer";
import "./emailscan.css";
import { FaInfo } from "react-icons/fa";


function EmailScan() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleScan = () => {
    if (!subject.trim() && !sender.trim() && !content.trim()) {
      setError("Please enter email content to analyze.");
      return;
    }
    setError("");
    const combinedContent = `Subject: ${subject}\nSender: ${sender}\nContent: ${content}`;
    navigate('/analysis', { state: { type: 'email', content: combinedContent } });
  };

  return (
    <div className="email-scan-page">


      {/* Decorative Background Elements */}
      <div className="bg-shield-left"></div>
      <div className="bg-shield-right"></div>

      <div className="scan-container">
        <h1 className="page-title">Email Scan</h1>

        <div className="scan-form-card">
          {/* Subject Field */}
          <div className="form-group">
            <label className="form-label">Email Subject</label>
            <textarea
              className="form-textarea subject-textarea"
              placeholder="Email Subject"
              maxLength={200}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            ></textarea>
          </div>

          {/* Sender Field */}
          <div className="form-group">
            <label className="form-label">Sender Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter sender's email address"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>

          {/* Content Field */}
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Paste the email content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        {error && <div className="error-message" style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

        {/* Detect Button */}
        <div className="detect-btn-container">
          <button className="detect-btn" onClick={handleScan}>Detect Threat</button>
        </div>

        {/* Risk Meter Section */}
        <div className="risk-meter-container">
          <div className="risk-segmented-bar">
            <div className="segment low"></div>
            <div className="segment medium"></div>
            <div className="segment high"></div>
          </div>

          <div className="risk-labels">
            <span className="risk-label low">Low Risk</span>
            <span className="risk-label medium">Medium Risk</span>
            <span className="risk-label high">High Risk</span>
          </div>

          <div className="info-box">
            <div className="info-icon"><FaInfo size={12} /></div>
            <span>If high risk, do not click links, report to admin. If low risk, safe to open.</span>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default EmailScan;
