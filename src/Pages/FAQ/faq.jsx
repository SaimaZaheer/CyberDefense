import React, { useState, useEffect } from "react";
import Footer from "../../components/Layout/footer";
import "./faq.css";

const faqs = [
  {
    question: "How does the AI phishing detection work?",
    answer: "Our system uses advanced machine learning models (NLP) to detect urgency cues, malicious keywords, and deceptive structural patterns commonly found in social engineering attacks."
  },
  {
    question: "Is my scanned data stored securely?",
    answer: "Absolutely. All submitted content is encrypted in transit and at rest. We adhere to rigorous data retention standards to guarantee your privacy and operational security."
  },
  {
    question: "What does Premium Analysis include?",
    answer: "Premium users bypass standard checks and receive deep behavioral analytics, geographic server intelligence, and domain registration metadata for enhanced proactive threat hunting."
  },
  {
    question: "Can I integrate this system into my enterprise?",
    answer: "Yes, our architecture supports API expansion. While our primary interface is the dashboard, enterprise clients can request custom webhook integrations for automated endpoint scanning."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-page-wrapper">
      <div className="faq-split-container">
        
        {/* Left Pane - FAQ Content */}
        <div className="faq-left-pane">
          <h1 className="faq-title text-glow">Frequently Asked Questions</h1>
          
          <div className="faq-search-container delay-1">
            <input 
              type="text" 
              className="faq-search-input" 
              placeholder="Search question here..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="faq-search-icon">⌕</div>
          </div>

          <div className="faq-accordion delay-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <div 
                    className="faq-question" 
                    onClick={() => toggleAccordion(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer-wrapper" style={{ maxHeight: activeIndex === index ? '200px' : '0px' }}>
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No questions match your search.</div>
            )}
          </div>
        </div>

        {/* Right Pane - Cyber Art Installation */}
        <div className="faq-right-pane delay-3">
           <div className="faq-art-container">
              <div className="huge-faq-text">
                <span className="letter f">F</span>
                <span className="letter a">A</span>
                <span className="letter q">Q</span>
              </div>
              <div className="floating-question-mark q1">?</div>
              <div className="floating-question-mark q2">?</div>
              <div className="faq-grid-floor"></div>
              <div className="faq-hologram-beam"></div>
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
