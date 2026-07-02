import React, { useRef, useState } from "react";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";
import Footer from "../../components/Layout/footer";
import "./contact.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { sendContactForm } from "../../services/api";

function Contact() {
    const containerRef = useRef(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !message) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await sendContactForm({
                name: `${firstName} ${lastName}`,
                email,
                subject: "Cyber Defense Contact Form",
                message
            });

            alert("Message sent successfully!");

            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");

        } catch (err) {
            alert(err.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline();
        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!firstName || !lastName || !email || !message) {
                alert("Please fill all fields");
                return;
            }

            try {
                setLoading(true);

                await sendContactForm({
                    name: `${firstName} ${lastName}`,
                    email,
                    subject: "Cyber Defense Contact Form",
                    message
                });

                alert("Message sent successfully!");

                setFirstName("");
                setLastName("");
                setEmail("");
                setMessage("");

            } catch (err) {
                alert(err.message || "Failed to send message");
            } finally {
                setLoading(false);
            }
        };
        // 1. Cyber Animation fade and zoom
        tl.fromTo(".cyber-animation-container",
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        )
            // 2. Title slide down
            .fromTo(".contact-title",
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
                "-=0.5"
            )
            // 3. Form groups stagger
            .fromTo(".form-group",
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out" },
                "-=0.3"
            )
            // 4. Submit button bounce
            .fromTo(".contact-submit-btn",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)", clearProps: "transform" },
                "-=0.2"
            );

        // Continuous button hover glowing effect is handled in CSS, but let's add a slow breathe to the form wrapper
        gsap.to(".contact-form-wrapper", {
            boxShadow: "0 0 30px rgba(0, 240, 255, 0.05), inset 0 0 10px rgba(0, 240, 255, 0.05)",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    return (
        <div className="contact-page-wrapper" ref={containerRef}>
            <div className="contact-main">
                <div className="contact-split-container">

                    {/* Left Column: Cyber Animation */}
                    <div className="contact-left">
                        <div className="cyber-animation-container">
                            <div className="radar-grid"></div>
                            <div className="shield-core">
                                <div className="shield-hex"></div>
                                <div className="shield-hex inner"></div>
                                <div className="lock-icon"></div>
                            </div>
                            <div className="orbiting-ring orbit-1"></div>
                            <div className="orbiting-ring orbit-2"></div>
                            <div className="orbiting-ring orbit-3"></div>
                            <div className="scanning-line"></div>
                        </div>
                        <div className="img-overlay-glow"></div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="contact-right">
                        <div className="contact-form-wrapper">
                            <h1 className="contact-title">Contact Us</h1>

                            <form className="cyber-contact-form" onSubmit={handleSubmit}>
                                {/* Dual Inputs for Name */}
                                <div className="form-group">
                                    <label>Name <span className="required">*</span></label>
                                    <div className="name-inputs">
                                        <div className="input-col">
                                            <input type="text"
                                                className="cyber-input"
                                                placeholder="First"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required />
                                        </div>
                                        <div className="input-col">
                                            <input type="text"
                                                className="cyber-input"
                                                placeholder="Last"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email <span className="required">*</span></label>
                                    <input type="email"
                                        className="cyber-input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Leave us a few words <span className="required">*</span></label>
                                    <textarea
                                        className="cyber-textarea"
                                        rows="4"
                                        placeholder="Your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="contact-submit-btn">
                                    SUBMIT <FaPaperPlane className="submit-icon" />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Contact;
