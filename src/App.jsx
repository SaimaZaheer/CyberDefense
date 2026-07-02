import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/dashboard";
import EmailScan from "./Pages/ScanEmail/emailscan";
import UrlScan from "./Pages/ScanURL/urlscan";
import WebScan from "./Pages/ScanWeb/webscan";
import SmsScan from "./Pages/ScanSMS/smsscan";
import Home from "./Pages/Home/home";
import Navbar from "./components/Layout/navbar";
import History from "./Pages/History/history";
import Analysis from "./Pages/Analysis/analysis";
import Premium from "./Pages/Premium/premium";
import PremiumAnalysis from "./Pages/Premium/premiumanalysis";
import Payment from "./Pages/Payment/payment";
import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Profile from "./Pages/Auth/profile";
import Contact from "./Pages/Contact/contact";
import About from "./Pages/About/about";
import FAQ from "./Pages/FAQ/faq";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  
  if (!user || user === "undefined") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/" || location.pathname === "/about" || location.pathname === "/faq";
  // Consider both login and signup as auth pages with full width and no navbar
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // User requested temporary debugging
    document.body.style.outline = "none";
    
    // Script to identify components causing horizontal overflow
    const findOverflowingElements = () => {
      const allElements = document.querySelectorAll('*');
      const docWidth = document.documentElement.clientWidth;
      
      let foundOverflow = false;
      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.tagName !== 'HTML' && el.tagName !== 'BODY') {
          console.warn("Overflowing Element:", el, "RectRight:", rect.right, "DocWidth:", docWidth);
          foundOverflow = true;
        }
      });
      if (!foundOverflow) console.log("No horizontal overflow detected on this page at current width.");
    };
    
    const timer = setTimeout(findOverflowingElements, 1000);
    window.addEventListener('resize', findOverflowingElements);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', findOverflowingElements);
    };
  }, [location.pathname]);

  return (
    <div className="app-container">
      {!isAuth && <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <div
        className={`main-content ${isHome ? "home-layout" : isAuth ? "auth-layout" : "dashboard-layout"}`}
        style={!isHome && !isAuth ? {
          marginLeft: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
          width: collapsed ? "calc(100% - var(--sidebar-collapsed-width))" : "calc(100% - var(--sidebar-width))"
        } : (isAuth ? { margin: 0, padding: 0, width: '100%' } : {})}
      >
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Secure Protected Views */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/scan-email" element={<ProtectedRoute><EmailScan /></ProtectedRoute>} />
          <Route path="/scan-url" element={<ProtectedRoute><UrlScan /></ProtectedRoute>} />
          <Route path="/scan-web" element={<ProtectedRoute><WebScan /></ProtectedRoute>} />
          <Route path="/scan-sms" element={<ProtectedRoute><SmsScan /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/premium-analysis" element={<ProtectedRoute><PremiumAnalysis /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

