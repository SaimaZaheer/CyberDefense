import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaCheckCircle, FaExclamationCircle, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { stripePromise } from './stripe';
import './payment.css';

const elementOptions = {
    style: {
        base: {
            iconColor: '#e2e8f0',
            color: '#e2e8f0',
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15.2px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': { color: '#e2e8f0' },
            '::placeholder': { color: '#475569' },
        },
        invalid: {
            iconColor: '#ef4444',
            color: '#ef4444',
        },
    },
};

const cardNumberOptions = { ...elementOptions, showIcon: false };

const PaymentForm = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Field States
    const [cardName, setCardName] = useState('');

    // Error States
    const [errors, setErrors] = useState({});
    const [stripeError, setStripeError] = useState(null);

    // Stripe Hooks
    const stripe = useStripe();
    const elements = useElements();

    // Brand State
    const [cardBrand, setCardBrand] = useState(null);

    const validateField = (name, value) => {
        let errorMsg = '';
        if (name === 'cardName') {
            const regex = /^[a-zA-Z\s]{3,50}$/;
            if (!regex.test(value)) errorMsg = 'Name must be 3-50 characters (letters/spaces only).';
        }
        return errorMsg;
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setCardName(value);
        setErrors(prev => ({ ...prev, cardName: validateField('cardName', value) }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        const newErrors = {};
        newErrors.cardName = validateField('cardName', cardName);
        if (!stripe || !elements) {
            return;
        }

        if (Object.values(newErrors).some(err => err !== '')) {
            setErrors(newErrors);
            return;
        }

        setIsProcessing(true);
        setStripeError(null);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.access_token;

        if (!token) {
            setStripeError("Authentication required.");
            setIsProcessing(false);
            return;
        }

        try {
            // Fetch client secret
            const response = await fetch('http://127.0.0.1:5000/api/test/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize payment');
            }

            // Confirm payment
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: cardName,
                    },
                }
            });

            if (result.error) {
                setStripeError(result.error.message);
                setIsProcessing(false);
                return;
            }
        } catch (err) {
            setStripeError(err.message || "Payment failed");
            setIsProcessing(false);
            return;
        }

        console.log("Payment Success");
        setIsProcessing(false);
        setIsSuccess(true);
        if (token) {
            try {
                await fetch('http://127.0.0.1:5000/api/test/make-premium', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (err) {
                console.error("DB Premium update failed", err);
            }
        }

        user.isPremium = true;
        user.is_premium = true;
        localStorage.setItem("user", JSON.stringify(user));

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const uIndex = users.findIndex(u => u.email === user.email);
        if (uIndex > -1) {
            users[uIndex].isPremium = true;
            users[uIndex].is_premium = true;
        } else if (user.email) {
            users.push(user);
        }
        localStorage.setItem("users", JSON.stringify(users));
        
        window.dispatchEvent(new Event('storage'));
        console.log("Premium Updated");

        setTimeout(() => {
            console.log("Redirecting to Premium Dashboard");
            navigate('/premium-analysis', { state: { type: 'system', content: 'Premium access unlocked successfully. Welcome to advanced threat intelligence!' } });
        }, 1000);
    };

    const renderValidationIcon = (fieldName, value) => {
        if (!value) return null;
        if (errors[fieldName]) return <FaExclamationCircle style={{ color: '#ef4444', marginLeft: '6px', fontSize: '14px', flexShrink: 0 }} />;
        return <FaCheckCircle style={{ color: '#22c55e', marginLeft: '6px', fontSize: '14px', flexShrink: 0 }} />;
    };

    return (
        <div className="payment-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="cyber-grid-bg"></div>

            <div className="payment-container" style={{ maxWidth: '480px', width: '100%', margin: '0 auto', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem 2rem', backdropFilter: 'blur(16px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

                <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Upgrade to Premium</h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                        <FaLock style={{ fontSize: '0.75rem' }} /> Demo Payment Environment
                    </div>
                </header>

                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <FaCheckCircle style={{ color: '#22c55e', fontSize: '3rem', marginBottom: '1rem' }} />
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Payment Successful</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Securing your connection and redirecting...</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Order Summary */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                            <div>
                                <h3 style={{ fontSize: '0.95rem', margin: 0, color: '#e2e8f0', fontWeight: 500 }}>Premium Access</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Billed monthly</p>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#fff' }}>$9.99<span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/mo</span></h3>
                        </div>

                        {/* Payment Form */}
                        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Form Fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, marginLeft: '0.2rem' }}>Cardholder Name</label>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: `1px solid ${errors.cardName ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '6px', padding: '0.6rem 0.8rem', transition: 'border-color 0.2s' }}>
                                            <input type="text" value={cardName} onChange={handleNameChange} placeholder="Name on card" style={{ background: 'transparent', border: 'none', color: '#e2e8f0', width: '100%', outline: 'none', fontSize: '0.95rem' }} />
                                            {renderValidationIcon('cardName', cardName)}
                                        </div>
                                        {errors.cardName && <span style={{ color: '#f87171', fontSize: '0.75rem', marginLeft: '0.2rem' }}>{errors.cardName}</span>}
                                    </div>

                                    {/* Stripe-like Unified Card Input Group */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, marginLeft: '0.2rem' }}>Card Details</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)', border: `1px solid ${stripeError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '6px', overflow: 'hidden', transition: 'border-color 0.2s' }}>

                                            {/* Row 1: Number */}
                                            <div style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                <div style={{ flex: 1, padding: '4px 0' }}>
                                                    <CardNumberElement 
                                                        options={cardNumberOptions} 
                                                        onChange={(e) => {
                                                            setCardBrand(e.brand === 'unknown' ? null : e.brand);
                                                            if (e.error) setStripeError(e.error.message);
                                                            else setStripeError(null);
                                                        }} 
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.3rem', color: '#64748b', fontSize: '1.2rem', marginLeft: '10px' }}>
                                                    {cardBrand === 'visa' && <FaCcVisa style={{ color: '#fff' }} />}
                                                    {cardBrand === 'mastercard' && <FaCcMastercard style={{ color: '#fff' }} />}
                                                    {cardBrand === 'amex' && <FaCcAmex style={{ color: '#fff' }} />}
                                                    {cardBrand === 'discover' && <FaCcDiscover style={{ color: '#fff' }} />}
                                                    {!cardBrand && (
                                                        <>
                                                            <FaCcVisa />
                                                            <FaCcMastercard />
                                                            <FaCcAmex />
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Row 2: Expiry / CVC */}
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ flex: 1, padding: '0.6rem 0.8rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <div style={{ padding: '4px 0' }}>
                                                        <CardExpiryElement 
                                                            options={elementOptions}
                                                            onChange={(e) => {
                                                                if (e.error) setStripeError(e.error.message);
                                                                else setStripeError(null);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, padding: '0.6rem 0.8rem' }}>
                                                    <div style={{ padding: '4px 0' }}>
                                                        <CardCvcElement 
                                                            options={elementOptions}
                                                            onChange={(e) => {
                                                                if (e.error) setStripeError(e.error.message);
                                                                else setStripeError(null);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtle Errors */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.2rem', marginLeft: '0.2rem' }}>
                                            {stripeError && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{stripeError}</span>}
                                        </div>
                                    </div>
                                </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                style={{
                                    marginTop: '0.5rem',
                                    width: '100%',
                                    padding: '0.85rem',
                                    borderRadius: '6px',
                                    background: isProcessing ? '#1d4ed8' : '#38bdf8', // Solid professional blue
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'background 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                {isProcessing ? (
                                    <span style={{ border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite', display: 'inline-block' }}></span>
                                ) : (
                                    <>Pay $9.99</>
                                )}
                            </button>
                            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', margin: 0 }}>Payments are secure and encrypted.</p>
                        </form>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                input::placeholder { color: #475569; }
            `}} />
        </div>
    );
};

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};

export default Payment;
