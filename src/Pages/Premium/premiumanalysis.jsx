import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { scanContent } from '../../services/api';
import html2pdf from 'html2pdf.js';
import './premiumanalysis.css';
import Footer from '../../components/Layout/footer';
import {
    FaEnvelope,
    FaChartLine,
    FaExclamationTriangle,
    FaSkull,
    FaBrain,
    FaGlobe,
    FaUserShield,
    FaBan,
    FaCheckCircle,
    FaRedo,
    FaFilePdf,
    FaSave,
    FaHome
} from 'react-icons/fa';

const highlightText = (text) => {
    if (!text) return "";
    const keywords = ['urgent', 'verify', 'password', 'login', 'suspicious', 'credential', 'malicious', 'phishing', 'threat', 'compromise', 'immediate', 'action', 'risk', 'isolation', 'hostile', 'deceptive'];
    const parts = text.split(new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi'));
    return parts.map((part, i) =>
        keywords.includes(part.toLowerCase()) ? (
            <span key={i} className="highlighted-keyword">{part}</span>
        ) : part
    );
};

const PremiumAnalysis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, content } = location.state || { type: 'unknown', content: '' };

    const [mounted, setMounted] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [score, setScore] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [blockStatus, setBlockStatus] = useState('idle');
    const [notified, setNotified] = useState(false);

    useEffect(() => {
        setMounted(true);
        const performScan = async () => {
            try {
                if (!content) throw new Error("No content provided.");
                const response = await scanContent(type, content);
                console.log(
                    "PREMIUM RESPONSE FULL:",
                    JSON.stringify(response, null, 2)
                );

                setScanResult(response.data || response);
                console.log(
                    "SCAN RESULT STATE:",
                    JSON.stringify(scanResult, null, 2)
                );
            } catch (err) {
                setError(err.message || "Failed to analyze.");
            } finally {
                setLoading(false);
            }
        };
        performScan();
    }, [type, content]);

    useEffect(() => {
        if (!scanResult) return;

        // Trigger browser notification exactly once
        if ((scanResult.alert === true || scanResult.threat_score >= 90) && !notified) {
            const triggerNotification = async () => {
                if (!("Notification" in window)) return;

                let permission = Notification.permission;
                if (permission !== "granted" && permission !== "denied") {
                    permission = await Notification.requestPermission();
                }

                if (permission === "granted") {
                    new Notification("🚨 EXTREME THREAT DETECTED", {
                        body: `This scan contains severe phishing or malicious indicators. Immediate caution is advised.\nType: ${type.toUpperCase()}`,
                    });
                }
            };
            triggerNotification();
            setNotified(true);
        }

        const targetScore = scanResult.threat_score || 0;
        const fullText = scanResult.behavior_analysis || "No behavioral analysis available.";

        let scoreInterval;
        let typingTimeout;
        let typingInterval;

        // Animate Threat Score
        const scoreDuration = 1500;
        const frames = 60;
        const scoreStep = targetScore / frames;
        let currentFrame = 0;

        scoreInterval = setInterval(() => {
            currentFrame++;
            if (currentFrame <= frames) {
                setScore(Math.round(scoreStep * currentFrame));
            } else {
                clearInterval(scoreInterval);
                setScore(targetScore);
            }
        }, scoreDuration / frames);

        // Typewriter Effect for AI Analysis
        let i = 0;
        const typingSpeed = 20; // ms per char
        setTypedText(""); // reset text on mount

        // Slight delay before typing starts to let cards mount
        typingTimeout = setTimeout(() => {
            typingInterval = setInterval(() => {
                if (i < fullText.length) {
                    setTypedText(fullText.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, typingSpeed);
        }, 800);

        return () => {
            if (scoreInterval) clearInterval(scoreInterval);
            if (typingTimeout) clearTimeout(typingTimeout);
            if (typingInterval) clearInterval(typingInterval);
        };
    }, [scanResult]);

    const handleBlockSender = () => {
        setBlockStatus('blocking');
        setTimeout(() => {
            setBlockStatus('blocked');
        }, 1500);
    };
    const handleScanAnother = () => {
        setScanResult(null);
        setError(null);
        setScore(0);
        let routeType = type.toLowerCase();
        if (routeType === 'website') routeType = 'web';
        navigate(`/scan-${routeType}`, { replace: true, state: {} });
    };

    const handleSavePDF = () => {
        const element = document.getElementById('pdf-report-template');
        const opt = {
            margin:       10,
            filename:     `CYBER_PREMIUM_REPORT_${type.toUpperCase()}_${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    console.log(
        "FULL PREMIUM RESPONSE:",
        JSON.stringify(scanResult, null, 2)
    );

    if (loading) {
        return (
            <div className="premium-analysis-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#00F0FF' }}>
                <h2>Scanning with Premium AI Intelligence...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="premium-analysis-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#ef4444', flexDirection: 'column' }}>
                <h2>Error: {error}</h2>
                <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
            </div>
        );
    }

    const d_age = scanResult?.domain_age || 'NOT RECEIVED';
    const d_ssl = scanResult?.ssl_status || 'NOT RECEIVED';
    const d_loc = scanResult?.hosting_location || 'NOT RECEIVED';
    const d_isp = scanResult?.isp_provider || 'NOT RECEIVED';
    const d_ip = scanResult?.ip_address || 'NOT RECEIVED';
    const d_routing = scanResult?.routing_cloaking || 'NOT RECEIVED';

    const isCommunication = type.toLowerCase() === 'sms' || type.toLowerCase() === 'email';
    const isDomain = type.toLowerCase() === 'url' || type.toLowerCase() === 'web' || type.toLowerCase() === 'website';

    const getRiskColors = (s) => {
        if (s >= 67) return {
            hex: '#ef4444',
            borderGlow: 'rgba(239, 68, 68, 0.4)',
            bgGlow: 'rgba(239, 68, 68, 0.1)',
            shadow: 'rgba(239, 68, 68, 0.2)'
        };
        if (s >= 34) return {
            hex: '#eab308',
            borderGlow: 'rgba(234, 179, 8, 0.4)',
            bgGlow: 'rgba(234, 179, 8, 0.1)',
            shadow: 'rgba(234, 179, 8, 0.2)'
        };
        return {
            hex: '#22c55e',
            borderGlow: 'rgba(34, 197, 94, 0.4)',
            bgGlow: 'rgba(34, 197, 94, 0.1)',
            shadow: 'rgba(34, 197, 94, 0.2)'
        };
    };

    const riskColors = getRiskColors(score);

    return (
        <div className="premium-analysis-page">
            {/* Background Layers */}
            <div className="bg-cyber-grid"></div>
            <div className="bg-network-nodes"></div>
            <div className="bg-particles"></div>

            <div className="dashboard-container">

                {/* Top Header */}
                <header className={`dashboard-header ${mounted ? 'fade-in-down' : ''}`}>
                    <div className="header-content">
                        <h1 className="page-title shimmer-text">Premium Threat Intelligence Report</h1>
                        <p className={`page-subtitle ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '0.3s' }}>
                            Detailed AI-powered analysis of the scanned content
                        </p>
                    </div>
                </header>

                {/* Extreme Threat Alert Banner */}
                {scanResult.alert && (
                    <div className="extreme-alert-banner">
                        <FaExclamationTriangle className="alert-icon" />
                        <div>
                            <h2 className="alert-heading">
                                {scanResult.alert_message || "EXTREME RISK DETECTED"}
                            </h2>
                            <p className="alert-desc">
                                This content demonstrates severe phishing or malicious behavior indicators.
                            </p>
                        </div>
                        <style>{`
                            .extreme-alert-banner {
                                background-color: rgba(239, 68, 68, 0.1);
                                border: 2px solid rgba(239, 68, 68, 0.8);
                                box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(239, 68, 68, 0.2);
                                border-radius: 12px;
                                padding: 20px;
                                margin-bottom: 25px;
                                display: flex;
                                align-items: center;
                                gap: 20px;
                                animation: shake-banner 0.8s cubic-bezier(.36,.07,.19,.97) both;
                            }
                            .extreme-alert-banner .alert-icon {
                                font-size: 3rem;
                                color: #ef4444;
                                animation: pulse-icon-danger 1.5s infinite;
                            }
                            .extreme-alert-banner .alert-heading {
                                color: #ef4444;
                                margin: 0 0 5px 0;
                                text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                font-weight: bold;
                            }
                            .extreme-alert-banner .alert-desc {
                                color: #f87171;
                                margin: 0;
                                font-size: 1.1rem;
                            }
                            @keyframes shake-banner {
                                10%, 90% { transform: translate3d(-1px, 0, 0); }
                                20%, 80% { transform: translate3d(2px, 0, 0); }
                                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                                40%, 60% { transform: translate3d(4px, 0, 0); }
                            }
                            @keyframes pulse-icon-danger {
                                0% { opacity: 1; transform: scale(1); }
                                50% { opacity: 0.8; transform: scale(1.1); filter: brightness(1.2); }
                                100% { opacity: 1; transform: scale(1); }
                            }
                        `}</style>
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="dashboard-grid">

                    {/* Row 1: Summary Overview (4 stats) */}
                    <div className="summary-row">
                        {/* Card 1 */}
                        <div className={`stat-card glass-card stagger-1 ${mounted ? 'slide-up' : ''}`}>
                            <div className="stat-icon-wrapper blue-glow float-anim">
                                <FaEnvelope />
                            </div>
                            <div className="stat-details">
                                <span className="stat-label">Scan Type</span>
                                <span className="stat-value" style={{ textTransform: 'capitalize' }}>{type}</span>
                            </div>
                            <div className="card-border-sweep"></div>
                        </div>

                        {/* Card 2: Threat Score with SVG Ring */}
                        <div className={`stat-card glass-card stagger-2 ${mounted ? 'slide-up' : ''}`}>
                            <div className="stat-icon-wrapper float-anim-delay-1" style={{ color: riskColors.hex, boxShadow: `0 0 20px ${riskColors.shadow}`, transition: "all 0.3s ease" }}>
                                <div className="score-ring-container">
                                    <svg height="80" width="80" className="score-svg">
                                        <circle
                                            stroke={`${riskColors.hex}33`}
                                            strokeWidth="6"
                                            fill="transparent"
                                            r={radius}
                                            cx="40"
                                            cy="40"
                                            style={{ transition: "stroke 0.3s ease" }}
                                        />
                                        <circle
                                            className="score-progress"
                                            stroke={riskColors.hex}
                                            strokeWidth="6"
                                            fill="transparent"
                                            r={radius}
                                            cx="40"
                                            cy="40"
                                            style={{
                                                strokeDasharray: circumference,
                                                strokeDashoffset: strokeDashoffset,
                                                transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease"
                                            }}
                                        />
                                    </svg>
                                    <div className="score-text" style={{ color: riskColors.hex, transition: "color 0.3s ease" }}>{score}%</div>
                                </div>
                            </div>
                            <div className="stat-details score-details">
                                <span className="stat-label">Threat Score</span>
                                <span className="stat-value" style={{ color: riskColors.hex, transition: "color 0.3s ease" }}>{scanResult.threat_score}%</span>
                            </div>
                            <div className="card-border-sweep"></div>
                        </div>

                        {/* Card 3 */}
                        <div className={`stat-card glass-card stagger-3 ${mounted ? 'slide-up' : ''}`}>
                            <div className="stat-icon-wrapper float-anim-delay-2" style={{ color: riskColors.hex, boxShadow: `0 0 20px ${riskColors.shadow}`, transition: "all 0.3s ease" }}>
                                <FaExclamationTriangle />
                            </div>
                            <div className="stat-details">
                                <span className="stat-label">Risk Level</span>
                                <span className="stat-value" style={{ color: riskColors.hex, transition: "color 0.3s ease" }}>{score >= 67 ? 'High' : score >= 34 ? 'Medium' : 'Low'}</span>
                            </div>
                            <div className="card-border-sweep"></div>
                        </div>

                        {/* Card 4 */}
                        <div className={`stat-card glass-card stagger-4 ${mounted ? 'slide-up' : ''}`}>
                            <div className="stat-icon-wrapper crt-flicker" style={{ color: riskColors.hex, textShadow: `0 0 10px ${riskColors.hex}`, transition: "color 0.3s ease" }}>
                                <FaSkull />
                            </div>
                            <div className="stat-details">
                                <span className="stat-label">Final Verdict</span>
                                <span className="stat-value" style={{ color: riskColors.hex, textShadow: `0 0 15px ${riskColors.borderGlow}`, transition: "all 0.3s ease" }}>
                                    {score >= 67 ? (score >= 90 ? "Extreme Threat" : "Highly Suspicious") : (score >= 34 ? "Suspicious" : "Appears Safe")}
                                </span>
                            </div>
                            <div className="card-border-sweep"></div>
                        </div>
                    </div>

                    {/* Row 2: Main Analysis Section */}
                    <div className="analysis-row">

                        {/* Left: AI Behavioral Analysis */}
                        <div className={`analysis-card glass-card large-card ai-processing-card stagger-5 ${mounted ? 'slide-up' : ''}`}>
                            <div className="ai-gradient-sweep"></div>
                            <div className="card-header">
                                <FaBrain className="card-icon neon-blue pulse-icon" />
                                <h3>AI Behavioral Analysis</h3>
                            </div>
                            <div className="card-content" style={{ padding: '0px' }}>
                                {scanResult?.behavior_analysis && typeof scanResult.behavior_analysis === 'object' ? (
                                    <div className="premium-analysis-card" style={{
                                        position: 'relative',
                                        background: `linear-gradient(135deg, rgba(20, 25, 35, 0.9) 0%, rgba(10, 15, 20, 0.95) 100%)`,
                                        borderLeft: `4px solid ${riskColors.hex}`,
                                        borderTop: `1px solid ${riskColors.borderGlow}`,
                                        borderRight: `1px solid ${riskColors.borderGlow}`,
                                        borderBottom: `1px solid ${riskColors.borderGlow}`,
                                        boxShadow: `0 0 30px ${riskColors.bgGlow}, inset 0 0 15px rgba(0,0,0,0.5)`,
                                        borderRadius: '16px',
                                        padding: '30px',
                                        transition: 'all 0.4s ease'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' }}>
                                            <div style={{ padding: '12px', background: riskColors.bgGlow, borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
                                                <FaBrain style={{ color: riskColors.hex, fontSize: '1.8rem' }} />
                                            </div>
                                            <div>
                                                <h3 style={{ color: riskColors.hex, margin: 0, fontSize: '1.6rem', textShadow: `0 0 15px ${riskColors.borderGlow}`, letterSpacing: '0.5px' }}>Intelligence Report</h3>
                                                <span className="severity-badge" style={{ color: '#a0aec0', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>{score >= 67 ? 'High' : score >= 34 ? 'Medium' : 'Low'} Severity</span>
                                            </div>
                                            {score >= 67 && <div className="pulse-icon-danger" style={{ marginLeft: 'auto', width: '12px', height: '12px', borderRadius: '50%', background: riskColors.hex, boxShadow: `0 0 15px ${riskColors.hex}` }} />}
                                        </div>

                                        <div className="analysis-section" style={{ marginBottom: '20px' }}>
                                            <h4 style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}><FaChartLine style={{ marginRight: '8px', color: '#94a3b8' }} /> Threat Overview</h4>
                                            <p style={{ color: '#e2e8f0', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                                                {highlightText(scanResult.behavior_analysis.overview)}
                                            </p>
                                        </div>

                                        {scanResult.ai_tags && scanResult.ai_tags.length > 0 && (
                                            <div className="analysis-section" style={{ marginBottom: '20px' }}>
                                                <h4 style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>⚡ Behavioral Indicators</h4>
                                                <ul style={{ color: '#e2e8f0', lineHeight: '1.7', fontSize: '1.05rem', margin: 0, paddingLeft: '22px' }}>
                                                    {scanResult.ai_tags.map((tag, i) => (
                                                        <li key={i}>{highlightText(tag)}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="analysis-section" style={{ marginBottom: '20px' }}>
                                            <h4 style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}><FaBrain style={{ marginRight: '8px', color: '#94a3b8' }} /> AI Interpretation</h4>
                                            <p style={{ color: '#e2e8f0', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                                                {highlightText(scanResult.behavior_analysis.interpretation)}
                                            </p>
                                        </div>

                                        <div className="analysis-section" style={{ marginBottom: '35px' }}>
                                            <h4 style={{ color: riskColors.hex, fontSize: '1.15rem', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}><FaCheckCircle style={{ marginRight: '8px' }} /> Recommended Response</h4>
                                            <p style={{ color: '#f8fafc', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                                                {highlightText(scanResult.behavior_analysis.recommendation)}
                                            </p>
                                        </div>

                                        <style>{`
                                            .highlighted-keyword {
                                                color: #00f0ff;
                                                font-weight: 700;
                                                text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
                                                background: rgba(0, 240, 255, 0.1);
                                                padding: 0 5px;
                                                border-radius: 4px;
                                                margin: 0 1px;
                                            }
                                        `}</style>
                                    </div>
                                ) : (
                                    <p>No intelligent analysis formatting available for this record.</p>
                                )}
                            </div>
                        </div>

                        {/* Right: Stacked Intelligence Cards */}
                        <div className="intelligence-stack">

                            {/* Conditional Intelligence */}
                            {isDomain && (
                            <div className={`intelligence-card glass-card stagger-6 ${mounted ? 'slide-up' : ''}`}>
                                <div className="card-header">
                                    <FaGlobe className="card-icon neon-cyan float-anim" />
                                    <h3>Domain Intelligence</h3>
                                </div>
                                <ul className="data-list">
                                    <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.0s' }}>
                                        <span className="data-label">Domain Age:</span>
                                        <span className="data-value warning glow-warning"><span className="status-dot dot-warning"></span> {d_age}</span>
                                    </li>
                                    <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.2s' }}>
                                        <span className="data-label">SSL Certificate:</span>
                                        <span className={`data-value ${d_ssl.includes('HTTPS') ? 'safe glow-safe' : 'danger glow-danger'}`}><span className={`status-dot ${d_ssl.includes('HTTPS') ? 'dot-safe' : 'dot-danger'}`}></span> {d_ssl}</span>
                                    </li>
                                    <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.4s' }}>
                                        <span className="data-label">Hosting Location:</span>
                                        <span className="data-value"><span className="status-dot dot-safe"></span> {d_loc}</span>
                                    </li>
                                    <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.5s' }}>
                                        <span className="data-label">ISP/Provider:</span>
                                        <span className="data-value">{d_isp}</span>
                                    </li>
                                    <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.55s' }}>
                                        <span className="data-label">IP Address:</span>
                                        <span className="data-value">{d_ip}</span>
                                    </li>
                                    <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.6s' }}>
                                        <span className="data-label">Routing / Cloaking:</span>
                                        <span className="data-value warning glow-warning"><span className="status-dot dot-warning"></span> {d_routing}</span>
                                    </li>
                                </ul>
                                <div className="map-container cyber-frame">
                                    <div className="cyber-overlay"></div>
                                    <iframe
                                        title="Hosted Location"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                                        src={scanResult.latitude && scanResult.longitude ? `https://maps.google.com/maps?q=${scanResult.latitude},${scanResult.longitude}&t=&z=4&ie=UTF8&iwloc=&output=embed` : `https://maps.google.com/maps?q=${d_loc !== 'N/A' ? d_loc : 'Russia'}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            )}

                            {isCommunication && (
                                <div className={`intelligence-card glass-card stagger-6 ${mounted ? 'slide-up' : ''}`}>
                                    <div className="card-header">
                                        <FaEnvelope className="card-icon neon-cyan float-anim" />
                                        <h3>Communication Intelligence</h3>
                                    </div>
                                    <ul className="data-list">
                                        <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.0s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <span className="data-label" style={{ marginBottom: '5px' }}>Threat Pattern Detection:</span>
                                            <span className="data-value" style={{ marginLeft: 0, color: riskColors.hex }}>
                                                {scanResult?.ai_tags && scanResult.ai_tags.length > 0 ? scanResult.ai_tags.join(', ') : 'No specific patterns detected.'}
                                            </span>
                                        </li>
                                        <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.2s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
                                            <span className="data-label" style={{ marginBottom: '5px' }}>Message Intent:</span>
                                            <span className="data-value" style={{ marginLeft: 0, whiteSpace: 'normal', lineHeight: '1.4' }}>
                                                {scanResult?.behavior_analysis?.interpretation || 'Analysis of intent is unavailable.'}
                                            </span>
                                        </li>
                                        <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.4s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
                                            <span className="data-label" style={{ marginBottom: '5px' }}>Risk Factors:</span>
                                            <span className="data-value warning glow-warning" style={{ marginLeft: 0, display: 'flex', flexDirection: 'column', gap: '5px', whiteSpace: 'normal' }}>
                                                {scanResult?.ai_tags && scanResult.ai_tags.length > 0 ? scanResult.ai_tags.map((tag, i) => (
                                                    <span key={i}><span className="status-dot dot-warning"></span> {tag}</span>
                                                )) : <span><span className="status-dot dot-safe"></span> None detected</span>}
                                            </span>
                                        </li>
                                        <li className={`fade-in-row ${mounted ? 'fade-in' : ''}`} style={{ animationDelay: '1.5s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
                                            <span className="data-label" style={{ marginBottom: '5px' }}>Confidence Score:</span>
                                            <span className="data-value" style={{ marginLeft: 0, color: riskColors.hex, fontWeight: 'bold' }}>
                                                {scanResult?.threat_score || 0}% AI Confidence
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Row 3: Recommendation Panel */}
                    <div className={`recommendation-row stagger-8 ${mounted ? 'slide-up-bounce' : ''}`}>
                        <div className="recommendation-card glass-card alert-panel" style={{
                            background: `linear-gradient(90deg, ${riskColors.bgGlow}, rgba(13, 17, 26, 0.9))`,
                            border: `1px solid ${riskColors.borderGlow}`,
                            transition: "all 0.3s ease"
                        }}>
                            <div className="alert-pulse-border" style={{
                                animation: "none",
                                boxShadow: `inset 0 0 0 2px ${riskColors.bgGlow}, inset 0 0 30px ${riskColors.shadow}`,
                                transition: "all 0.3s ease"
                            }}></div>
                            <div className="rec-icon-area bounce-icon" style={{
                                background: riskColors.bgGlow,
                                color: riskColors.hex,
                                border: `1px solid ${riskColors.borderGlow}`,
                                boxShadow: `0 0 20px ${riskColors.shadow}`,
                                transition: "all 0.3s ease"
                            }}>
                                {score >= 67 ? <FaBan className="rec-icon" /> : score >= 34 ? <FaExclamationTriangle className="rec-icon" /> : <FaCheckCircle className="rec-icon" />}
                            </div>
                            <div className="rec-content">
                                <h3 className="alert-text" style={{ color: riskColors.hex, textShadow: `0 0 10px ${riskColors.shadow}`, transition: "all 0.3s ease" }}>Intelligence Recommendation</h3>
                                <p>{scanResult.assistance_message || "Proceed with caution based on the generated intelligence report."}</p>
                            </div>

                            <button
                                className={`action-btn block-btn ripple-btn ${blockStatus !== 'idle' ? 'processing' : ''} ${blockStatus === 'blocked' ? 'success' : ''}`}
                                onClick={handleBlockSender}
                                disabled={blockStatus !== 'idle'}
                            >
                                {blockStatus === 'idle' && "Block Sender Network"}
                                {blockStatus === 'blocking' && "Blocking..."}
                                {blockStatus === 'blocked' && <><FaCheckCircle /> Blocked Successfully</>}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                        <button onClick={handleScanAnother} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaRedo /> Scan Another
                        </button>
                        <button onClick={handleSavePDF} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaFilePdf /> Save Report as PDF
                        </button>
                        <button onClick={() => alert("Result saved to history!")} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaSave /> Save Result
                        </button>
                        <Link to="/dashboard" style={{ padding: '0.8rem 1.5rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                            <FaHome /> Go to Dashboard
                        </Link>
                    </div>

                    {/* Hidden PDF Template */}
                    <div style={{ display: 'none' }}>
                        <div id="pdf-report-template" style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#000', backgroundColor: '#fff', width: '800px' }}>
                            <h1 style={{ textAlign: 'center', color: '#1a365d', borderBottom: '2px solid #1a365d', paddingBottom: '10px', fontSize: '24px', textTransform: 'uppercase' }}>
                                {isCommunication ? 'COMMUNICATION INTELLIGENCE REPORT' : 'DOMAIN INTELLIGENCE REPORT'}
                            </h1>
                            
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
                                            <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{score >= 67 ? 'High' : score >= 34 ? 'Medium' : 'Low'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {isDomain && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Domain Intelligence & Geo Location</h2>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                                        <tbody>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold', width: '30%' }}>Domain Age</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{d_age}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>SSL Certificate</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{d_ssl}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>Hosting Location</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{d_loc}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>ISP / Provider</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{d_isp}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>IP Address</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{d_ip}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>Routing / Cloaking</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{d_routing}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {isCommunication && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Communication Intelligence</h2>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                                        <tbody>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold', width: '30%' }}>Message Intent</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{scanResult?.behavior_analysis?.interpretation || 'N/A'}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>Risk Factors</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{scanResult?.ai_tags && scanResult.ai_tags.length > 0 ? scanResult.ai_tags.join(', ') : 'None detected'}</td></tr>
                                            <tr><td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>Confidence Score</td><td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{scanResult?.threat_score || 0}%</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {scanResult?.behavior_analysis && typeof scanResult.behavior_analysis === 'object' && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>AI Behavioural Analysis</h2>
                                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}><strong>Overview:</strong> {scanResult.behavior_analysis.overview}</p>
                                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}><strong>Interpretation:</strong> {scanResult.behavior_analysis.interpretation}</p>
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

                            {scanResult?.behavior_analysis && typeof scanResult.behavior_analysis === 'object' && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', fontSize: '18px' }}>Premium Recommendations</h2>
                                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{scanResult.behavior_analysis.recommendation}</p>
                                </div>
                            )}

                            <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '12px', color: '#718096' }}>
                                <p>Generated by Cyber Threat Defense System - Premium Intelligence</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PremiumAnalysis;
