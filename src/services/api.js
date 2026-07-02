const API_BASE_URL = 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => {
    try {
        const userStr = localStorage.getItem("user");
        console.log("Stored user string:", userStr);
        if (!userStr || userStr === "undefined" || userStr === "null") {
            return { "Content-Type": "application/json" };
        }
        const user = JSON.parse(userStr);
        const token = user?.access_token;
        if (token) {
            return {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
        }
    } catch (err) {
        console.error("Error parsing auth headers:", err);
    }
    return { "Content-Type": "application/json" };
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
    }

    return await response.json();
};

export const signupUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Signup failed');
    }

    return await response.json();
};

export const scanContent = async (type, content) => {
    console.log("Sending scan request:", { type, content });

    if (!type || !content) {
        throw new Error("Missing scan type or content");
    }

    const headers = getAuthHeaders();
    if (!headers.Authorization) {
        throw new Error("Authentication required for scanning");
    }

    const response = await fetch(`${API_BASE_URL}/scan/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ type, content })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Scan failed (Server Error)');
    }

    const result = await response.json();
    console.log("RAW BACKEND RESPONSE:", result);
    return result;
};

export const getHistory = async (riskLevel = null) => {
    let url = `${API_BASE_URL}/history/`;
    if (riskLevel) {
        url += `?risk_level=${encodeURIComponent(riskLevel)}`;
    }

    const headers = getAuthHeaders();
    if (!headers.Authorization) {
        throw new Error("Authentication required to fetch history");
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch history (Server Error)');
    }

    return await response.json();
};
export const sendContactForm = async (formData) => {
    const response = await fetch('http://127.0.0.1:5000/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
    }

    return await response.json();
};
