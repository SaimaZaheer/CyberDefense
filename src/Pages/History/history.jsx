import React, { useState, useEffect } from "react";
import Footer from "../../components/Layout/footer";
import "./history.css";
import { getHistory } from "../../services/api";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

function History() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [typeFilter, setTypeFilter] = useState("All");
    const [riskFilter, setRiskFilter] = useState("All");
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const apiRiskLevel = riskFilter !== "All" ? riskFilter : null;
                const data = await getHistory(apiRiskLevel);
                setHistoryData(data.scans || []);
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [riskFilter]);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const filteredData = historyData.filter(row => {
        const matchType = typeFilter === "All" || (row.type && row.type.toLowerCase() === typeFilter.toLowerCase());
        const matchRisk = riskFilter === "All" || (row.risk_level && row.risk_level.toLowerCase() === riskFilter.toLowerCase());
        return matchType && matchRisk;
    });

    const typeOptions = ["All", "Email", "URL", "SMS", "Website"];
    const riskOptions = ["All", "Safe", "Suspicious", "Malicious", "Extreme"];

    return (
        <div className="history-page">

            {/* Decorative Background Elements */}
            <div className="bg-shield-left"></div>
            <div className="bg-shield-right"></div>

            <div className="history-container">
                <h1 className="page-title delay-1">Scan History</h1>

                <div className="filter-section delay-2">
                    
                    <div className="filter-pill-container">
                        <button 
                            className={`filter-pill ${typeFilter !== 'All' ? 'active-pill' : ''}`}
                            onClick={() => toggleDropdown('type')}
                        >
                            Content Type 
                            {typeFilter !== 'All' && <span className="pill-badge">1</span>}
                        </button>
                        {openDropdown === 'type' && (
                            <div className="filter-dropdown-menu">
                                {typeOptions.map(t => (
                                    <div 
                                        key={t} 
                                        className={`dropdown-option ${typeFilter === t ? 'selected' : ''}`} 
                                        onClick={() => { setTypeFilter(t); setOpenDropdown(null); }}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="filter-pill-container">
                        <button 
                            className={`filter-pill ${riskFilter !== 'All' ? 'active-pill' : ''}`}
                            onClick={() => toggleDropdown('risk')}
                        >
                            Risk Level 
                            {riskFilter !== 'All' && <span className="pill-badge">1</span>}
                        </button>
                        {openDropdown === 'risk' && (
                            <div className="filter-dropdown-menu">
                                {riskOptions.map(r => (
                                    <div 
                                        key={r} 
                                        className={`dropdown-option ${riskFilter === r ? 'selected' : ''}`} 
                                        onClick={() => { setRiskFilter(r); setOpenDropdown(null); }}
                                    >
                                        {r}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="history-card delay-3">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#00F0FF' }}>
                            <FaSpinner className="fa-spin" size={24} />
                            <p style={{ marginTop: '1rem' }}>Loading History...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                            <FaExclamationTriangle size={24} />
                            <p style={{ marginTop: '1rem' }}>{error}</p>
                        </div>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Content</th>
                                    <th>Threat %</th>
                                    <th>Risk Level</th>
                                    <th>Assistance Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((row, index) => (
                                        <tr key={index} className="table-row-anim" style={{ animationDelay: `${0.1 * index}s` }}>
                                            <td style={{textTransform: 'capitalize'}}>{row.type}</td>
                                            <td>
                                                {row.content && row.content.length > 50 ? (
                                                    <div className="content-tooltip-container">
                                                        {row.content.substring(0, 50)}...
                                                        <div className="content-tooltip">
                                                            {row.content}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    row.content || 'N/A'
                                                )}
                                            </td>
                                            <td>{row.threat_score}%</td>
                                            <td>
                                                <span className={`risk-badge ${row.risk_level ? row.risk_level.toLowerCase() : 'unknown'}`}>
                                                    {row.risk_level || 'Unknown'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="assistance-text">
                                                    {row.alert ? <span style={{color: '#ef4444', fontWeight: 'bold'}}>[ALERT] </span> : null}
                                                    {row.assistance_message || (row.alert ? row.alert_message : 'N/A')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-results-msg">No scans match your selected filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default History;
