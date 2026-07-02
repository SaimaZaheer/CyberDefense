import React, { useState } from "react";
import Footer from "../../components/Layout/footer";
import "./webscan.css";
import { FaInfo } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";



function WebScan() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");

    const handleScan = () => {
        navigate('/analysis', { state: { type: 'website', content } });
    };
    return (
        <div className="web-scan-page">


            {/* Decorative Background Elements */}
            <div className="bg-shield-left"></div>
            <div className="bg-shield-right"></div>

            <div className="scan-container">
                <h1 className="page-title">Website Scan</h1>

                <div className="scan-form-card">
                    {/* Content Field */}
                    <div className="form-group">
                        <input
                            type="url"
                            className="form-input"
                            placeholder="Paste Website link here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

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

export default WebScan;
