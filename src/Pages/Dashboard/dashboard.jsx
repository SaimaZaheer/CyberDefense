import React, { useRef } from "react";
import "./dashboard.css";
import { FaShieldAlt, FaEnvelope, FaCommentAlt, FaLink, FaGlobe, FaCrown, FaLock, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Layout/footer";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Dashboard() {
  const containerRef = useRef(null);
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

  useGSAP(() => {
    const tlBoot = gsap.timeline();

    // Background elements fade in quickly
    tlBoot.fromTo(".dashboard-bg-grid",
      { opacity: 0 },
      { opacity: 0.2, duration: 1.5, ease: "power2.inOut" }
    )
      .fromTo(".particles-container",
        { opacity: 0 },
        { opacity: 0.5, duration: 2, ease: "power2.out" },
        "-=1"
      )
      .fromTo(".dashboard-bg-shield",
        { opacity: 0, scale: 1.05 },
        { opacity: 0.03, scale: 1, duration: 2, ease: "power2.out" },
        "-=1.5"
      );

    // Header fades down quickly
    tlBoot.from(".header-icon-wrapper",
      { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" },
      "-=0.5"
    )
      .from(".db-title",
        { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .from(".db-subtitle",
        { y: -10, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );

    // Intro text fades in quickly
    tlBoot.from(".intro-text",
      { opacity: 0, y: 10, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    // Cards animate upward quickly
    tlBoot.fromTo(".scan-card",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
        onComplete: () => {
          // Floating Anti-Gravity Micro Motion
          const cards = gsap.utils.toArray(".scan-card");
          cards.forEach((card) => {
            gsap.to(card, {
              y: `+=${gsap.utils.random(3, 6)}`,
              duration: gsap.utils.random(4, 6),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: gsap.utils.random(0, 1)
            });
          });
        }
      },
      "-=1.0"
    );

    // Animate inner content
    tlBoot.fromTo(".card-header",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(".card-desc",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.7"
    );

    // Continuous Shield Floating 
    gsap.to(".dashboard-bg-shield", {
      y: "-=15",
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Background Parallax
    gsap.to(".dashboard-bg-grid", {
      y: 50,
      ease: "none",
      scrollTrigger: {
        trigger: ".dashboard-content",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: containerRef });

  return (
    <div className="dashboard-page" ref={containerRef}>
      {/* Background Elements */}
      <div className="dashboard-bg-grid"></div>
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
      <FaShieldAlt className="dashboard-bg-shield" />

      {/* Main Content */}
      <div className="dashboard-content">
        <button className="db-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '6px' }} /> Logout
        </button>

        {/* Dashboard Header */}
        <div className="db-main-header">
          <div className="header-icon-wrapper">
            <FaShieldAlt className="header-shield-icon" />
          </div>
          <h1 className="db-title">Cyber Defense Dashboard</h1>
          <p className="db-subtitle">
            This dashboard serves as the central hub for analyzing suspicious emails, SMS messages, URLs, and websites. Our AI-powered detection engine helps identify phishing attempts and malicious threats quickly and efficiently.
          </p>
        </div>

        {/* Dashboard Introduction Plain Text */}
        <div className="intro-text">
          <p>
            The Cyber Defense Dashboard allows users to scan different types of online content for phishing attacks and malicious activity. Select a scanning tool below to begin analyzing potential threats using our AI detection engine.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          <Link to="/scan-email" className="scan-card">
            <div className="card-border-glow"></div>
            <div className="card-content">
              <div className="card-header">
                <FaEnvelope className="card-icon" />
                <div className="card-title">Email Scan</div>
              </div>
              <p className="card-desc">Analyze suspicious emails to detect hidden phishing attempts, spoofed senders, and malicious attachments before they can harm your system.</p>
            </div>
          </Link>

          <Link to="/scan-sms" className="scan-card">
            <div className="card-border-glow"></div>
            <div className="card-content">
              <div className="card-header">
                <FaCommentAlt className="card-icon" />
                <div className="card-title">SMS Scan</div>
              </div>
              <p className="card-desc">Identify "Smishing" attacks by scanning incoming text messages for dangerous financial links and social engineering hooks.</p>
            </div>
          </Link>

          <Link to="/scan-url" className="scan-card">
            <div className="card-border-glow"></div>
            <div className="card-content">
              <div className="card-header">
                <FaLink className="card-icon" />
                <div className="card-title">URL Scan</div>
              </div>
              <p className="card-desc">Instantly verify unknown links against dynamic threat databases to intercept malicious redirects and zero-day malware.</p>
            </div>
          </Link>

          <Link to="/scan-web" className="scan-card">
            <div className="card-border-glow"></div>
            <div className="card-content">
              <div className="card-header">
                <FaGlobe className="card-icon" />
                <div className="card-title">Website Scan</div>
              </div>
              <p className="card-desc">Deep-scan entire domains for embedded malicious scripts, hidden iframe vulnerabilities, and fake login forms.</p>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
