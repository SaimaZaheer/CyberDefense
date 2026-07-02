import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Layout/footer";
import "./analysis.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { scanContent } from "../../services/api";
import { generateGuidance } from "../../utils/guidanceEngine";
import html2pdf from 'html2pdf.js';

import {
    FaExclamationTriangle, FaShieldAlt, FaBug, FaLink, FaUserSecret,
    FaArrowRight, FaRedo, FaSave, FaHome, FaSpinner, FaCheckCircle,
    FaUserCheck, FaGlobe, FaMobileAlt, FaLock, FaExclamationCircle,
    FaClock, FaKey, FaMoneyBillWave, FaEnvelopeOpenText, FaMobile,
    FaPhoneAlt, FaSkullCrossbones, FaStopwatch, FaUserShield,
    FaWallet, FaFileExcel, FaNetworkWired, FaSms, FaBan, FaRoute, FaFilePdf
} from "react-icons/fa";

const ICON_MAP = {
    FaShieldAlt: <FaShieldAlt />,
    FaUserCheck: <FaUserCheck />,
    FaGlobe: <FaGlobe />,
    FaMobileAlt: <FaMobileAlt />,
    FaLock: <FaLock />,
    FaLink: <FaLink />,
    FaExclamationCircle: <FaExclamationCircle />,
    FaClock: <FaClock />,
    FaKey: <FaKey />,
    FaUserSecret: <FaUserSecret />,
    FaMoneyBillWave: <FaMoneyBillWave />,
    FaEnvelopeOpenText: <FaEnvelopeOpenText />,
    FaMobile: <FaMobile />,
    FaPhoneAlt: <FaPhoneAlt />,
    FaSkullCrossbones: <FaSkullCrossbones />,
    FaStopwatch: <FaStopwatch />,
    FaUserShield: <FaUserShield />,
    FaWallet: <FaWallet />,
    FaFileExcel: <FaFileExcel />,
    FaNetworkWired: <FaNetworkWired />,
    FaSms: <FaSms />,
    FaBan: <FaBan />,
    FaRoute: <FaRoute />
};

function Analysis() {
    const containerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { type, content } = location.state || { type: 'unknown', content: '' };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [showAlertBanner, setShowAlertBanner] = useState(false);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const isPremium = user?.isPremium;

    useEffect(() => {
        if (isPremium) {
            navigate('/premium-analysis', { state: { type, content }, replace: true });
            return;
        }

        const performScan = async () => {
            try {
                if (!content || !content.trim()) {
                    setScanResult({ isEmpty: true });
                    setLoading(false);
                    return;
                }
                const result = await scanContent(type, content);
                setScanResult(result);

                if (result.threat_score >= 90 || result.alert === true) {
                    setShowAlertBanner(true);

                    if ("Notification" in window) {
                        const notify = () => {
                            new Notification("⚠️ Extreme Threat Detected", {
                                body: result.alert_message || "Immediate action required."
                            });
                        };

                        if (Notification.permission === "granted") {
                            notify();
                        } else if (Notification.permission !== "denied") {
                            Notification.requestPermission().then(permission => {
                                if (permission === "granted") notify();
                            });
                        }
                    }
                }
            } catch (err) {
                const emptyMsgs = [
                    "Please enter SMS content to analyze.",
                    "Please enter email content to analyze.",
                    "Please enter a URL to analyze.",
                    "Please enter a website address to analyze.",
                    "Type and content are required."
                ];
                if (emptyMsgs.includes(err.message)) {
                    setScanResult({ isEmpty: true });
                } else {
                    setError(err.message || "Failed to perform analysis");
                }
            } finally {
                setLoading(false);
            }
        };

        performScan();
    }, [type, content, isPremium, navigate]);

    const handleScanAnother = () => {
        setScanResult(null);
        setError(null);
        setAnimatedScore(0);
        let routeType = type.toLowerCase();
        if (routeType === 'website') routeType = 'web';
        navigate(`/scan-${routeType}`, { replace: true, state: {} });
    };

    const handleSavePDF = () => {
        const element = document.getElementById('pdf-report-template');
        const opt = {
            margin:       10,
            filename:     `CYBER_REPORT_${type.toUpperCase()}_${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    // Animate Score
    useEffect(() => {
        if (!scanResult) return;
        const target = scanResult.threat_score || 0;
        const duration = 1500;
        const frames = 60;
        const step = target / frames;
        let current = 0;
        const interval = setInterval(() => {
            current++;
            if (current <= frames) {
                setAnimatedScore(Math.round(step * current));
            } else {
                clearInterval(interval);
                setAnimatedScore(target);
            }
        }, duration / frames);
        return () => clearInterval(interval);
    }, [scanResult]);

    useGSAP(() => {
        if (loading || error || !scanResult || scanResult.isEmpty) return;

        const tlStart = gsap.timeline();

        if (showAlertBanner) {
            tlStart.fromTo(".alert-banner",
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out" }
            );
        }

        // Title slide down
        tlStart.fromTo(".page-title",
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
            showAlertBanner ? "-=0.2" : 0
        )
            // Verdict Card zoom in with dramatic effect
            .fromTo(".verdict-card",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)", clearProps: "transform" },
                "-=0.4"
            )
            // Content preview fade in
            .fromTo(".preview-row",
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
                "-=0.2"
            )
            // Breakdown cards stagger up
            .fromTo(".breakdown-card",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" },
                "-=0.2"
            )
            // Recommendation box jump
            .fromTo(".recommendation-box",
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "bounce.out" },
                "-=0.2"
            );

        // Continuous floating background shields
        gsap.to(".bg-shield-left, .bg-shield-right", {
            rotation: 5,
            scale: 1.05,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef, dependencies: [loading, error, scanResult, showAlertBanner] });

    if (scanResult && scanResult.isEmpty) {
        return (
            <div className="analysis-page">
                <div className="analysis-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                    <div className="verdict-card" style={{ borderColor: 'rgba(56, 189, 248, 0.3)', background: 'rgba(15, 23, 42, 0.8)', boxShadow: '0 0 30px rgba(0,0,0,0.5)', maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
                        <FaExclamationCircle style={{ color: '#38bdf8', fontSize: '3rem', marginBottom: '1.5rem' }} />
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1rem', marginTop: 0 }}>No Content Provided</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>Enter content before starting a security analysis.</p>
                        <Link to={`/scan-${type.toLowerCase()}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaArrowRight /> Return to Scanner
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="analysis-page">
                <div className="analysis-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <h2 style={{ color: '#00F0FF' }}><FaSpinner className="fa-spin" /> Analyzing Threat...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analysis-page">
                <div className="analysis-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                    <h2 style={{ color: '#ef4444' }}><FaExclamationTriangle /> Scan Error</h2>
                    <p style={{ color: '#fff' }}>{error}</p>
                    <Link to="/dashboard" className="btn btn-primary mt-4"><FaHome /> Go to Dashboard</Link>
                </div>
            </div>
        );
    }

    const getVerdictColors = (score) => {
        if (score >= 67) return { risk: 'High', colorClass: 'high-risk', iconColor: '#ef4444', borderGlow: 'rgba(239,68,68,0.5)', shadowGlow: 'rgba(239,68,68,0.2)' };
        if (score >= 34) return { risk: 'Medium', colorClass: 'medium-risk', iconColor: '#eab308', borderGlow: 'rgba(234,179,8,0.5)', shadowGlow: 'rgba(234,179,8,0.2)' };
        return { risk: 'Low', colorClass: 'low-risk', iconColor: '#22c55e', borderGlow: 'rgba(34,197,94,0.5)', shadowGlow: 'rgba(34,197,94,0.2)' };
    };

    const dynamicColors = getVerdictColors(animatedScore);

    const verdict = {
        risk: dynamicColors.risk,
        score: animatedScore,
        title: scanResult.alert ? `EXTREME RISK - ${scanResult.alert_message || "Immediate Action Required"}` : `${dynamicColors.risk} Risk Detected`,
        colorClass: dynamicColors.colorClass,
        iconColor: dynamicColors.iconColor,
        borderGlow: dynamicColors.borderGlow,
        shadowGlow: dynamicColors.shadowGlow
    };

    const previewData = {
        type: type.toUpperCase(),
        content: content.length > 100 ? content.substring(0, 100) + "..." : content
    };

    const guidance = scanResult ? generateGuidance(type, content, scanResult.risk_level) : null;

    return (
        <div className="analysis-page" ref={containerRef}>
            {/* Decorative Background */}
            <div className="bg-shield-left"></div>
            <div className="bg-shield-right"></div>

            <div className="analysis-container">

                {showAlertBanner && (
                    <div className="alert-banner">
                        <FaExclamationTriangle className="alert-banner-icon" />
                        <div className="alert-banner-text">
                            <strong>WARNING:</strong> {scanResult.alert_message || "Critical threat detected! Immediate action required."}
                        </div>
                    </div>
                )}

                <h1 className="page-title">Threat Analysis Result</h1>

                {/* Verdict Card */}
                <div className="verdict-card" style={{
                    borderColor: verdict.borderGlow,
                    boxShadow: `0 0 30px ${verdict.shadowGlow}`,
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                }}>
                    <FaExclamationTriangle className="verdict-icon" style={{ color: verdict.iconColor, transition: 'color 0.3s ease' }} />
                    <div className="verdict-title" style={{ color: verdict.iconColor, transition: 'color 0.3s ease' }}>
                        {verdict.title}
                    </div>
                    <div className="verdict-score">
                        Threat Confidence Score: <span style={{ color: verdict.iconColor, fontWeight: "bold", transition: 'color 0.3s ease' }}>{verdict.score}%</span>
                    </div>

                    {/* Threat Meter */}
                    <div className="threat-meter">
                        <div className="meter-bar">
                            <div className="meter-segment low" style={{ background: animatedScore >= 0 ? '#22c55e' : 'rgba(255,255,255,0.1)', boxShadow: animatedScore >= 0 ? '0 0 10px #22c55e' : 'none', transition: 'all 0.3s ease' }}></div>
                            <div className="meter-segment medium" style={{ background: animatedScore >= 34 ? '#eab308' : 'rgba(255,255,255,0.1)', boxShadow: animatedScore >= 34 ? '0 0 10px #eab308' : 'none', transition: 'all 0.3s ease' }}></div>
                            <div className="meter-segment high" style={{ background: animatedScore >= 67 ? '#ef4444' : 'rgba(255,255,255,0.1)', boxShadow: animatedScore >= 67 ? '0 0 10px #ef4444' : 'none', transition: 'all 0.3s ease' }}></div>
                        </div>
                        <div className="meter-labels">
                            <span style={{ color: animatedScore >= 0 && animatedScore < 34 ? '#22c55e' : '#94a3b8', transition: 'color 0.3s ease' }}>Low</span>
                            <span style={{ color: animatedScore >= 34 && animatedScore < 67 ? '#eab308' : '#94a3b8', transition: 'color 0.3s ease' }}>Medium</span>
                            <span style={{ color: animatedScore >= 67 ? '#ef4444' : '#94a3b8', transition: 'color 0.3s ease' }}>High</span>
                        </div>
                    </div>
                </div>

                {/* Scanned Content Preview */}
                <div className="content-preview">
                    <div className="preview-row">
                        <span className="preview-label">Type:</span>
                        <span className="preview-value">{previewData.type}</span>
                    </div>
                    <div className="preview-row">
                        <span className="preview-label">Content:</span>
                        <span className="preview-value">{previewData.content}</span>
                    </div>
                </div>

                {/* AI Breakdown Grid */}
                {isPremium ? (
                    <>
                        <h2 style={{ alignSelf: 'flex-start', marginLeft: '0.5rem', marginBottom: '1rem', fontSize: '1.2rem', color: '#94a3b8' }}>Premium AI Breakdown</h2>
                        <div className="breakdown-grid">
                            {scanResult.domain_info && (
                                <div className="breakdown-card">
                                    <FaLink className="breakdown-icon c-blue" />
                                    <div className="breakdown-title">Domain Info</div>
                                    <div className="breakdown-desc">{scanResult.domain_info}</div>
                                </div>
                            )}
                            {scanResult.geo_location && (
                                <div className="breakdown-card">
                                    <FaUserSecret className="breakdown-icon c-red" />
                                    <div className="breakdown-title">Geo Location</div>
                                    <div className="breakdown-desc">{scanResult.geo_location}</div>
                                </div>
                            )}
                            {scanResult.behavior_analysis && (
                                <div className="breakdown-card">
                                    <FaBug className="breakdown-icon c-yellow" />
                                    <div className="breakdown-title">Behavior Analysis</div>
                                    <div className="breakdown-desc">{scanResult.behavior_analysis}</div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="premium-upsell" style={{ textAlign: 'left', padding: '1rem 1.5rem', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <FaShieldAlt size={24} style={{ color: '#00F0FF' }} />
                            <div>
                                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Premium Analysis Available</h3>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Unlock domain intelligence, geo-tracking, and detailed behavioral data.</p>
                            </div>
                        </div>
                        <Link to="/premium" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: '#38bdf8', color: '#38bdf8' }}>Upgrade Now</Link>
                    </div>
                )}

                {/* Rule-Based Guidance Engine */}
                {guidance && (
                    <div className="guidance-section" style={{ width: '100%', marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Guidance & Recommendations</h2>

                        <div className="guidance-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {guidance.cards.map((card, idx) => (
                                <div key={idx} className="guidance-card" style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid', borderColor: card.type === 'Security Advice' ? '#22c55e' : card.type === 'Potential Concern' ? '#ef4444' : '#38bdf8' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: card.type === 'Security Advice' ? '#22c55e' : card.type === 'Potential Concern' ? '#ef4444' : '#38bdf8', fontSize: '1.2rem' }}>
                                        {ICON_MAP[card.icon]}
                                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{card.type}</h4>
                                    </div>
                                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0', fontSize: '0.95rem' }}>{card.title}</h5>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>{card.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* What Should You Do Next? */}
                        <div className="next-steps-container" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1.5rem', width: '100%' }}>
                            <h3 style={{ color: '#fff', margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle style={{ color: '#38bdf8' }} /> What Should You Do Next?
                            </h3>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#cbd5e1' }}>
                                {guidance.nextSteps.map((step, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={handleScanAnother}>
                        <FaRedo /> Scan Another
                    </button>
                    <button className="btn btn-secondary" onClick={handleSavePDF}>
                        <FaFilePdf /> Save Report as PDF
                    </button>
                    <button className="btn btn-secondary" onClick={() => alert("Result saved to history!")}>
                        <FaSave /> Save Result
                    </button>
                    <Link to="/dashboard" className="btn btn-primary">
                        <FaHome /> Go to Dashboard
                    </Link>
                </div>

                {/* Hidden PDF Template */}
                <div style={{ display: 'none' }}>
                    <div id="pdf-report-template" style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#000', backgroundColor: '#fff', width: '800px' }}>
                        <h1 style={{ textAlign: 'center', color: '#1a365d', borderBottom: '2px solid #1a365d', paddingBottom: '10px', fontSize: '24px' }}>CYBER THREAT ANALYSIS REPORT</h1>
                        
                        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                            <p style={{ margin: '5px 0' }}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                            <p style={{ margin: '5px 0' }}><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                            <p style={{ margin: '5px 0' }}><strong>Scan Type:</strong> {type.toUpperCase()}</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Original Content</h2>
                            <div style={{ padding: '15px', backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px', wordBreak: 'break-all', fontSize: '14px', lineHeight: '1.5' }}>
                                {content}
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Threat Analysis</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '10px', border: '1px solid #e2e8f0', fontWeight: 'bold', width: '30%' }}>Threat Score</td>
                                        <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{scanResult?.threat_score || 0}%</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>Risk Level</td>
                                        <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{verdict?.risk || 'Unknown'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>Final Verdict</td>
                                        <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{verdict?.title || 'Unknown'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {guidance && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Recommendations</h2>
                                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                                    {guidance.nextSteps.map((step, idx) => (
                                        <li key={idx} style={{ marginBottom: '5px' }}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {scanResult?.ai_tags && scanResult.ai_tags.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Threat Indicators</h2>
                                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                                    {scanResult.ai_tags.map((tag, idx) => (
                                        <li key={idx} style={{ marginBottom: '5px' }}>{tag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '12px', color: '#718096' }}>
                            <p>Generated by Cyber Threat Defense System</p>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default Analysis;
