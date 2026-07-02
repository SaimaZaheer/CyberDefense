export const generateGuidance = (scanType, content, riskLevel) => {
    const text = (content || "").toLowerCase();
    const type = (scanType || "unknown").toLowerCase();

    const result = {
        cards: [],
        nextSteps: []
    };

    const hasUrgency = /\b(urgent|immediate|action|required|suspend|warning|alert|act fast|now)\b/i.test(text);
    const hasCredentials = /\b(password|login|account|verify|authenticate|sign in|credential|ssn)\b/i.test(text);
    const hasFinancial = /\b(bank|payment|invoice|transfer|billing|money|wallet|crypto|bitcoin|wire)\b/i.test(text);
    const isShortened = /\b(bit\.ly|t\.co|goo\.gl|tinyurl|ow\.ly|is\.gd|buff\.ly|adf\.ly|bit\.do)\b/i.test(text);
    const hasLinks = /\b(http|www\.|https)\b/i.test(text) || type === 'url' || type === 'website';
    const isSocialEngineering = /\b(boss|ceo|gift card|favor|help me|emergency)\b/i.test(text);

    let addedTip = false;

    if (riskLevel === "Safe") {
        result.cards.push({ id: 1, type: "Security Advice", title: "No Immediate Threat Detected", icon: "FaShieldAlt", text: "Continue exercising normal online caution. The analyzed content does not display current active threat indicators." });

        if (type === "email") {
            result.cards.push({ id: 2, type: "Protection Tip", title: "Verify Sender Identity", icon: "FaUserCheck", text: "Even when content appears safe, verify the sender's true identity before sharing any sensitive information." });
        } else if (type === "url" || type === "website") {
            result.cards.push({ id: 3, type: "Protection Tip", title: "Keep Browser Updated", icon: "FaGlobe", text: "Ensure your device and browser are running the latest security patches before navigating to new sites." });
        } else if (type === "sms") {
            result.cards.push({ id: 4, type: "Security Advice", title: "Standard Interactions", icon: "FaMobileAlt", text: "This message matches standard interpersonal or safe automated notifications." });
        } else {
            result.cards.push({ id: 5, type: "Protection Tip", title: "Multi-Factor Authentication", icon: "FaLock", text: "Enable MFA where available to secure accounts against unforeseen threats." });
        }

        if (hasLinks) {
            result.cards.push({ id: 6, type: "Security Advice", title: "Link Navigation", icon: "FaLink", text: "Hover over the link to verify the exact destination matches your expectations before proceeding." });
        }

    } else if (riskLevel === "Suspicious") {
        result.cards.push({ id: 7, type: "Potential Concern", title: "Elevated Risk", icon: "FaExclamationCircle", text: "The system flagged anomalous patterns within this request. Proceed with high caution." });

        if (hasUrgency) {
            result.cards.push({ id: 8, type: "Security Advice", title: "Avoid Rushed Decisions", icon: "FaClock", text: "Artificial urgency is commonly used to bypass critical thinking. Take your time to review the request." });
        }
        if (hasCredentials) {
            result.cards.push({ id: 9, type: "Protection Tip", title: "Credential Verification", icon: "FaKey", text: "Never provide authentication details through an unsolicited link. Navigate manually to the official domain." });
            addedTip = true;
        }
        if (isShortened) {
            result.cards.push({ id: 10, type: "Potential Concern", title: "Obfuscated Destination", icon: "FaUserSecret", text: "Shortened URLs mask the true destination. Use a URL expansion tool before clicking." });
        }
        if (hasFinancial) {
            result.cards.push({ id: 11, type: "Potential Concern", title: "Financial Irregularity", icon: "FaMoneyBillWave", text: "Suspicious financial requests often lead to wire fraud. Verify payment instructions carefully." });
        }

        if (type === "email") {
            result.cards.push({ id: 12, type: "Protection Tip", title: "Inspect Headers", icon: "FaEnvelopeOpenText", text: "Check the exact sender address, not just the display name, for spoofing attempts." });
        } else if (type === "sms") {
            result.cards.push({ id: 13, type: "Security Advice", title: "Unsolicited Mobile Contact", icon: "FaMobile", text: "Be cautious of unsolicited messages urging you to reply or tap links from unknown numbers." });
        } else {
            if (!addedTip) {
                result.cards.push({ id: 14, type: "Protection Tip", title: "Out-of-band Verification", icon: "FaPhoneAlt", text: "Contact the purported sender through a known, trusted phone number to verify this request." });
            }
        }

    } else {
        result.cards.push({ id: 15, type: "Potential Concern", title: "Malicious Intent Confirmed", icon: "FaSkullCrossbones", text: "Critical heuristical flags have been triggered. This asset exhibits severe threat signatures." });

        if (hasUrgency) {
            result.cards.push({ id: 16, type: "Potential Concern", title: "High Urgency Coercion", icon: "FaStopwatch", text: "High urgency language detected. Legitimate organizations rarely demand immediate action under severe penalty." });
        }
        if (hasCredentials) {
            result.cards.push({ id: 17, type: "Security Advice", title: "Active Credential Harvesting", icon: "FaUserShield", text: "Never enter passwords through unsolicited links. Attackers are likely attempting to steal your access tokens." });
        }
        if (hasFinancial) {
            result.cards.push({ id: 18, type: "Protection Tip", title: "Imminent Financial Scam", icon: "FaWallet", text: "Do not transfer funds under pressure. Confirm banking details specifically through official, secure channels only." });
        }
        if (isSocialEngineering) {
            result.cards.push({ id: 19, type: "Potential Concern", title: "Targeted Impersonation", icon: "FaUserSecret", text: "The communication attempts to impersonate a figure of authority (like a CEO) to extort funds or data." });
        }

        if (type === "url" || type === "website") {
            result.cards.push({ id: 20, type: "Security Advice", title: "Hostile Domain Detected", icon: "FaGlobe", text: "Domain characteristics strongly indicate fraudulent activity. Avoid parsing external scripts from this host." });
            if (isShortened) {
                result.cards.push({ id: 21, type: "Potential Concern", title: "Malicious Shortlink", icon: "FaLink", text: "The obfuscated routing is hiding a confirmed hostile tracking or malware deployment endpoint." });
            }
        } else if (type === "email") {
            result.cards.push({ id: 22, type: "Protection Tip", title: "Hostile Attachments", icon: "FaFileExcel", text: "Do not open any unexpected attachments associated with this email, as they likely contain macro viruses." });
            result.cards.push({ id: 23, type: "Security Advice", title: "Spoofed Sender Network", icon: "FaNetworkWired", text: "The sender domain is likely spoofed. Check SPF/DKIM mismatches if you govern a corporate network." });
        } else if (type === "sms") {
            result.cards.push({ id: 24, type: "Security Advice", title: "Smishing Attack", icon: "FaSms", text: "This is a recognized SMS phishing (Smishing) vector. Block the sender and do not respond." });
        } else {
            if (!hasUrgency && !hasCredentials && !hasFinancial && !isSocialEngineering) {
                result.cards.push({ id: 25, type: "Protection Tip", title: "Immediate Isolation", icon: "FaBan", text: "Halt all interaction immediately. The payload is designed to compromise system integrity silently." });
            }
        }

        if (hasLinks) {
            result.cards.push({ id: 26, type: "Security Advice", title: "Malicious Routing", icon: "FaRoute", text: "The embedded routing path is inherently toxic. Ensure your firewall drops connections to this subnet." });
        }
    }

    result.cards = result.cards.slice(0, 3);

    if (riskLevel === "Safe") {
        result.nextSteps = [
            "Continue normally with your interaction.",
            "Stay cautious and maintain standard security hygiene.",
            "Monitor future communications for any escalation."
        ];
    } else if (riskLevel === "Suspicious") {
        result.nextSteps = [
            "Do not click links or download files immediately.",
            "Verify the sender's identity through an alternative, trusted channel.",
            "Confirm the authenticity of the request before providing any information.",
            "Review the specific red flags flagged in the analysis before proceeding."
        ];
    } else {
        result.nextSteps = [
            "Avoid all interaction with this asset immediately.",
            "Do not provide credentials, financial data, or sensitive information.",
            "If you entered data recently, immediately reset passwords via official channels.",
            "Report and delete the artifact to prevent accidental interaction.",
            "Run a local malware sweep if you clicked any associated executable files."
        ];
    }

    return result;
};
