import React, { useEffect } from "react";
import Footer from "../../components/Layout/footer";
import "./about.css";

const About = () => {
  useEffect(() => {
    // Scroll to top when mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-wrapper">
      <div className="about-split-container">
        {/* Left Side: Animated Cyber Element Instead of static image */}
        <div className="about-left-pane">
          <div className="cyber-art-container">
            <div className="cyber-sphere">
              <div className="sphere-ring ring-1"></div>
              <div className="sphere-ring ring-2"></div>
              <div className="sphere-ring ring-3"></div>
              <div className="sphere-core"></div>
              <div className="sphere-grid"></div>
            </div>
            
            <div className="floating-elements">
              <div className="float-box fb-1"></div>
              <div className="float-box fb-2"></div>
              <div className="flare"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="about-right-pane">
          <h1 className="about-title">
             <span className="text-reveal">About us.</span>
          </h1>
          
          <div className="about-content">
            <div className="about-intro">
               Focused on excellence for our clients, we are well established, with a reputation for great service and a high-quality finish, bringing proactive cyber resilience to the digital frontier.
            </div>
            
            <div className="about-description">
              <p>With our roots in high-end threat detection, CYBER DEFENSE works on a wide spectrum of projects, with top international organizations and security architects. We delight in securing digital frontiers, from luxury brand networks to ambitious, large-scale financial institutions.</p>
              
              <p>The magic happens at our Security Neural Node - a state-of-the-art virtual facility. A large, flexible infrastructure that's dynamically reconfigured for every job, creating the optimum defense environment with plenty of computational power to neutralize threats prior to execution.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
