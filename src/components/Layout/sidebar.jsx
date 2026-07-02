import { FaShieldAlt, FaChartBar, FaEnvelope, FaLink, FaBell } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="sidebar">
      <h4 className="sidebar-logo">PhishGuard AI</h4>

      <ul className="sidebar-menu">
        <li><FaChartBar /> Dashboard</li>
        <li><FaEnvelope /> Email Scan</li>
        <li><FaLink /> URL Scan</li>
        <li><FaShieldAlt /> Threat Analysis</li>
        <li><FaBell /> Alerts</li>
      </ul>
    </div>
  );
}

export default Sidebar;
