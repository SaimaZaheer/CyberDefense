import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <h1>CyberDefense</h1>
          <p>
            AI-powered phishing detection for SMS, Emails, URLs, and malicious links.
          </p>
          <button className="hero-btn" onClick={() => navigate('/login')}>Get Started</button>
        </div>

        <div className="hero-visual">
          <div className="visual-box"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
