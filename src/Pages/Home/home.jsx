import React, { useRef } from "react";
import "./home.css";
import { FaShieldAlt, FaUserSecret, FaCreditCard, FaDatabase, FaEnvelope, FaCommentAlt, FaGlobe, FaChevronRight } from "react-icons/fa";
import Footer from "../../components/Layout/footer";
import { useNavigate } from "react-router-dom";

// GSAP Imports
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function Home() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useGSAP(() => {
        // 1. Hero Section Animations
        const tlHero = gsap.timeline();

        // Logo: slide down, fade in, bounce
        tlHero.fromTo(".hero-logo-shield",
            { y: -100, opacity: 0 },
            { y: 0, opacity: 0.05, duration: 1.2, ease: "power4.out" }
        )
            // Title: fade up, letters animate individually
            .fromTo(".char",
                { y: 50, opacity: 0, filter: "blur(10px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.05, ease: "back.out(1.7)", clearProps: "transform,filter" },
                "-=0.6"
            )
            // Subtitle: fade in upward
            .fromTo(".hero-subtitle",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.4"
            )
            // CTA button: fade in, scale up
            .fromTo(".hero-cta-btn",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)", clearProps: "transform" },
                "-=0.4"
            );

        // 2. Threats Grid
        gsap.fromTo(".threat-item",
            { y: 50, opacity: 0, scale: 0.9, rotation: -2 },
            {
                scrollTrigger: {
                    trigger: ".threats-grid",
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                clearProps: "transform" // allows CSS hover to take over
            }
        );

        // Continuous levitation effect for threats inner wrapper (won't conflict with CSS hover on .threat-item)
        gsap.to(".threat-icon-wrapper", {
            y: -10,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.3
        });

        // 3. Steps Section
        gsap.fromTo(".step-item",
            { x: -50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".steps-container",
                    start: "top 85%",
                },
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            }
        );

        gsap.fromTo(".step-arrow",
            { scale: 0, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".steps-container",
                    start: "top 85%",
                },
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.2,
                ease: "back.out(1.5)",
                delay: 0.3,
                clearProps: "transform,opacity" // Re-enable CSS animation
            }
        );

        // 4. Detection Cards
        gsap.fromTo(".detection-card",
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".detection-grid",
                    start: "top 80%",
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power4.out",
                clearProps: "transform" // allows CSS hover to take over
            }
        );

        // 5. AI Section
        const tlAI = gsap.timeline({
            scrollTrigger: {
                trigger: ".ai-section",
                start: "top 80%",
            }
        });

        tlAI.fromTo(".ai-section .section-title",
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)", clearProps: "transform" }
        )
            .fromTo(".ai-word",
                { y: 30, opacity: 0, scale: 0.5, filter: "blur(5px)" },
                { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, stagger: 0.05, ease: "back.out(1.7)", clearProps: "transform,filter" },
                "-=0.4"
            );

    }, { scope: containerRef });

    // Helper to wrap text in spans for individual letter animation
    const animateText = (text) => {
        return text.split("").map((char, index) => (
            <span key={index} className="char" style={{ display: "inline-block", whiteSpace: "pre" }}>
                {char}
            </span>
        ));
    };

    const animateWords = (text) => {
        return text.split(" ").map((word, index) => (
            <span key={index} className="ai-word" style={{ display: "inline-block", marginRight: "0.25em" }}>
                {word}
            </span>
        ));
    };

    const userStr = localStorage.getItem("user");
    const isLoggedIn = userStr !== null && userStr !== "undefined";

    const handleAction = (path = '/dashboard') => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="home-page" ref={containerRef}>
            <div className="hero-section">
                <FaShieldAlt className="hero-logo-shield" />
                <h1 className="hero-title">
                    {animateText("CyberDefense ")}
                    <span className="highlight" style={{ display: "inline-block" }}>
                        {animateText("AI")}
                    </span>
                </h1>
                <p className="hero-subtitle">
                    An AI-Based Phishing Detection System for Emails, SMS, and Links
                </p>
                <button className="hero-cta-btn" onClick={() => handleAction()}>
                    {isLoggedIn ? "Go to Dashboard" : "Go to Detection Dashboard"}
                </button>
            </div>

            <div className="section-divider"></div>

            <div className="section-container">
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <h2 className="section-title" style={{ textAlign: "center", margin: "0 auto" }}>Why Phishing Is a Serious Threat</h2>
                </div>
                <p className="section-description">
                    Phishing attacks via emails, SMS, and malicious links are designed to steal your personal information and compromise your security.
                </p>

                <div className="threats-grid">
                    <div className="threat-item" onClick={() => handleAction()}>
                        <div className="threat-icon-wrapper">
                            <div className="threat-icon-bg"></div>
                            <FaUserSecret className="threat-icon" />
                        </div>
                        <span className="threat-label">Identity Theft</span>
                    </div>

                    <div className="threat-item" onClick={() => handleAction()}>
                        <div className="threat-icon-wrapper">
                            <div className="threat-icon-bg"></div>
                            <FaCreditCard className="threat-icon" />
                        </div>
                        <span className="threat-label">Financial Fraud</span>
                    </div>

                    <div className="threat-item" onClick={() => handleAction()}>
                        <div className="threat-icon-wrapper">
                            <div className="threat-icon-bg"></div>
                            <FaDatabase className="threat-icon" />
                        </div>
                        <span className="threat-label">Data Breaches</span>
                    </div>
                </div>
            </div>

            <div className="section-divider"></div>

            <div className="section-container">
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <h2 className="section-title" style={{ textAlign: "center", margin: "0 auto" }}>How CyberDefense Works</h2>
                </div>
                <div style={{ height: "20px" }}></div>

                <div className="steps-container">
                    <div className="step-item" onClick={() => handleAction()}>
                        <span className="step-number">1</span>
                        <span className="step-text">User Submits Content</span>
                    </div>
                    <FaChevronRight className="step-arrow" />

                    <div className="step-item" onClick={() => handleAction()}>
                        <span className="step-number">2</span>
                        <span className="step-text">AI-Based Analysis</span>
                    </div>
                    <FaChevronRight className="step-arrow" />

                    <div className="step-item" onClick={() => handleAction()}>
                        <span className="step-number">3</span>
                        <span className="step-text">Threat Classification</span>
                    </div>
                    <FaChevronRight className="step-arrow" />

                    <div className="step-item" onClick={() => handleAction()}>
                        <span className="step-number">4</span>
                        <span className="step-text">User Alert & Recommendation</span>
                    </div>
                </div>
            </div>

            <div className="section-container">
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <h2 className="section-title" style={{ textAlign: "center", margin: "0 auto" }}>What CyberDefense Can Detect</h2>
                </div>
                <div style={{ height: "30px" }}></div>

                <div className="detection-grid">
                    <div className="detection-card" onClick={() => handleAction('/scan-email')}>
                        <FaEnvelope className="card-icon" />
                        <h3 className="card-title">Email Phishing</h3>
                        <p className="card-desc">Detects fraudulent emails.</p>
                    </div>

                    <div className="detection-card" onClick={() => handleAction('/scan-sms')}>
                        <FaCommentAlt className="card-icon" />
                        <h3 className="card-title">SMS (Smishing)</h3>
                        <p className="card-desc">Identifies malicious text messages.</p>
                    </div>

                    <div className="detection-card" onClick={() => handleAction('/scan-url')}>
                        <FaGlobe className="card-icon" />
                        <h3 className="card-title">Malicious URLs</h3>
                        <p className="card-desc">Flags dangerous links.</p>
                    </div>
                </div>
            </div>

            <div className="section-divider"></div>

            <div className="section-container ai-section">
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <h2 className="section-title" style={{ textAlign: "center", margin: "0 auto" }}>Why AI-Based Detection?</h2>
                </div>
                <p className="ai-text" style={{ opacity: 1 }}>
                    {animateWords("AI-based detection is used in cyber defense systems to identify phishing attacks and malicious content by analyzing patterns, behaviors, and contextual signals rather than relying only on predefined rules. Unlike traditional detection methods, AI can detect previously unknown threats, process large volumes of data quickly, and continuously improve its accuracy through learning from new attack patterns. This makes AI an effective approach for detecting modern phishing attacks across emails, SMS messages, URLs, and websites.")}
                </p>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
