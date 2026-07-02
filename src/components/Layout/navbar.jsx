import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaHistory, FaUser, FaBars, FaTimes, FaCrown, FaChevronLeft, FaChevronRight, FaEnvelope } from "react-icons/fa";
import "./navbar.css";

const Navbar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userStr = localStorage.getItem("user");
  const isLoggedIn = userStr !== null && userStr !== "undefined";
  const user = isLoggedIn ? JSON.parse(userStr) : {};
  const isPremium = user.isPremium === true;

  // Menu items
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, link: "/dashboard" },
    { name: "History", icon: <FaHistory />, link: "/history" },
    ...(isPremium ? [] : [{ name: "Premium", icon: <FaCrown />, link: "/premium" }]),
    { name: "Contact", icon: <FaEnvelope />, link: "/contact" },
    { name: "Profile", icon: <FaUser />, link: "/profile" },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={`navbar-container ${isHome ? "horizontal" : "vertical"} ${collapsed ? "collapsed" : ""
        }`}
      data-layout={isHome ? "horizontal" : "vertical"}
    >
      {/* Brand / Logo Area */}
      <div className="navbar-brand">
        <Link to="/" className="logo-text" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', flexShrink: 0 }}>
            <path d="M12 2L3 6V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V6L12 2Z" fill="#0f1c30" stroke="#00f0ff" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 4L12 21C16 19.8 19 15.6 19 11V7.2L12 4Z" fill="rgba(0, 240, 255, 0.2)" />
          </svg>
          Cyber<span className="accent">Defense</span>
          {isPremium && <span style={{ marginLeft: '10px', fontSize: '0.7rem', background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}><FaCrown style={{ marginBottom: '2px', marginRight: '3px' }} />PRO</span>}
        </Link>
        {!isHome && (
          <button className="collapse-btn" onClick={toggleCollapse}>
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        )}
        {/* Mobile menu toggle for horizontal layout if needed */}
        {isHome && (
          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Menu Items */}
      <ul className={`navbar-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {menuItems.map((item) => (
          <li key={item.name} className="menu-item">
            <Link to={isLoggedIn ? item.link : "/login"} className="menu-link" onClick={() => setMobileMenuOpen(false)}>
              <span className="icon">{item.icon}</span>
              {(!collapsed || isHome) && <span className="text">{item.name}</span>}
            </Link>
          </li>
        ))}

        {/* Action Button inside the menu for centered layout on Home */}
        {isHome && (
          <li className="menu-item action-item">
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
          </li>
        )}

      </ul>

      {/* Desktop Action Button Area (for sidebar/dashboard layout) */}
      {/* Button removed as per request to only show on homepage */}
    </nav>
  );
};

export default Navbar;
