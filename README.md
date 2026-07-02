# 🛡️ CyberDefense – AI-Powered Phishing Detection Platform

CyberDefense is a full-stack web application that detects phishing attacks across multiple communication channels using Machine Learning, Natural Language Processing (NLP), and URL analysis.

The platform helps users identify suspicious Emails, SMS messages, URLs, and Websites by providing real-time threat analysis, risk scoring, and security recommendations.

---

## 🚀 Features

- 📧 Email Phishing Detection
- 💬 SMS Phishing Detection
- 🔗 URL Analysis
- 🌐 Website Security Analysis
- 🤖 AI-based Threat Scoring
- 📊 Scan History Dashboard
- 📄 PDF Report Generation
- 🔔 Browser Push Notifications
- 👤 User Authentication
- 💳 Premium Membership (Stripe Integration)

---

## 🧠 Machine Learning Models

### 📧 Email Detection
- Algorithm: Calibrated Logistic Regression
- Dataset: Kaggle Phishing Email Dataset
- Accuracy: **96.59%**
- Precision: **96.12%**
- Recall: **97.37%**
- F1 Score: **96.74%**

---

### 💬 SMS Detection
- Algorithm: Calibrated Logistic Regression
- Dataset: SMS Spam Collection Dataset
- Accuracy: **96.32%**
- Precision: **92.18%**
- Recall: **79.19%**
- F1 Score: **85.20%**

---

### 🔗 URL Detection
- Algorithm: Random Forest
- Dataset Size:
  - 316,254 Benign URLs
  - 316,254 Malicious URLs
- Training Sample:
  - 100,000 URLs from each class
- Accuracy: **98.67%**

---

## ⚙️ Technology Stack

### Frontend
- React.js
- Vite
- Bootstrap
- CSS
- React Router

### Backend
- Flask
- Python

### Machine Learning
- Scikit-learn
- Logistic Regression
- Random Forest
- TF-IDF Vectorization
- NLP Feature Engineering

### Database
- MySQL
- SQLAlchemy

### Authentication
- JWT Authentication

### Payment Gateway
- Stripe

### PDF Reports
- html2pdf.js

---

## 🏗️ System Architecture

```
User
   │
   ▼
Frontend (React)
   │
   ▼
Flask REST API
   │
   ├── Email Detection Model
   ├── SMS Detection Model
   ├── URL Detection Model
   ├── Website Analysis Module
   ├── Threat Scoring Engine
   └── Recommendation Engine
            │
            ▼
         MySQL Database
```

---

## 📊 Threat Analysis

CyberDefense evaluates multiple indicators including:

- Machine Learning Prediction
- URL Reputation
- SSL Certificate Validation
- Domain Intelligence
- NLP Keyword Analysis
- Credential Requests
- Financial Keywords
- Urgency Detection
- Risk Classification

The system then generates:

- Threat Percentage
- Risk Level
- Personalized Security Recommendations

---

## 📂 Project Structure

```
backend/
│
├── controllers/
├── routes/
├── models/
├── config/
├── utils/
├── ml/
│     ├── Email Model
│     ├── SMS Model
│     ├── URL Model
│
└── app.py

src/
│
├── Pages/
├── Components/
├── Services/
└── Assets/
```

---

## 🔐 Security Features

- Password Hashing
- JWT Authentication
- Protected Routes
- Scan History
- Secure API Communication
- Environment Variables
- Threat Intelligence Checks

---

## 📸 Screenshots
<img width="1813" height="861" alt="Screenshot 2026-05-30 190011" src="https://github.com/user-attachments/assets/5619b2f5-4a7e-4918-8863-723ce6c4053e" />
<img width="935" height="852" alt="Screenshot 2026-05-30 201902" src="https://github.com/user-attachments/assets/f3280664-d12d-425b-ad1c-183cbfdb0773" />
<img width="1874" height="847" alt="Screenshot 2026-05-30 210241" src="https://github.com/user-attachments/assets/6dccaeaf-e54d-4d1a-9270-14e285cf7379" />
<img width="1876" height="854" alt="Screenshot 2026-05-30 212434" src="https://github.com/user-attachments/assets/8d7bf0e2-9064-4236-a521-c6a8beddacc8" />
<img width="1874" height="854" alt="Screenshot 2026-05-30 202746" src="https://github.com/user-attachments/assets/ea40501d-0723-40fe-9716-1b1bebb02de0" />
<img width="680" height="779" alt="Screenshot 2026-05-30 185901" src="https://github.com/user-attachments/assets/ff329b72-5336-49a4-8929-5ab97533e56b" />



---

## 👩‍💻 Author

**Saima Zaheer**

Computer Science Undergraduate

Passionate about:

- Cybersecurity
- Artificial Intelligence
- Machine Learning
- Web Development
- Research

---

## ⭐ Future Improvements

- Deep Learning-based Email Detection
- Real-time Threat Intelligence APIs
- Browser Extension
- Mobile Application
- WHOIS Reputation Scoring
- VirusTotal Integration
- Explainable AI (XAI)
- Multilingual Phishing Detection

---

## 📜 License

This project is developed for educational and research purposes.
