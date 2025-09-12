import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function OrderSuccessModal({ isOpen, onClose, orderId, customerName, itemCount }) {
    const navigate = useNavigate();
    const [isAnimated, setIsAnimated] = useState(false);
    
    // Toast notification state
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger animation after component mounts
            const timer = setTimeout(() => setIsAnimated(true), 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleTrackOrder = () => {
        onClose();
        // Navigate to tracking page with the order ID as a URL parameter
        navigate(`/tracking?orderId=${encodeURIComponent(orderId)}`);
    };

    const handleContinueShopping = () => {
        onClose();
        navigate('/menu');
    };

    const handleCopyOrderId = async () => {
        try {
            await navigator.clipboard.writeText(orderId);
            
            // Show toast notification
            setShowToast(true);
            
            // Auto-hide toast after 3 seconds
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
            
        } catch (err) {
            console.error('Failed to copy order ID:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = orderId;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                // Show toast notification for fallback method too
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };

    // Close toast manually
    const closeToast = () => {
        setShowToast(false);
    };

    if (!isOpen) return null;

    return (
        <div className="order-success-overlay">
            {/* Toast Notification */}
            {showToast && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <div className="toast-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="toast-details">
                            <div className="toast-title">Copied!</div>
                            <div className="toast-description">
                                Order ID copied to clipboard
                            </div>
                        </div>
                        <button className="toast-close" onClick={closeToast}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="toast-progress">
                        <div className="toast-progress-bar"></div>
                    </div>
                </div>
            )}

            <div className={`order-success-modal ${isAnimated ? 'animated' : ''}`}>
                {/* Success Icon */}
                <div className="success-icon-container">
                    <div className="success-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#26b24b"/>
                            <path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="success-confetti">
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="success-content">
                    <h1 className="success-title">🎉 Order Placed Successfully!</h1>
                    <p className="success-subtitle">
                        Thank you {customerName ? customerName.split(' ')[0] : 'for your order'}! 
                        Your delicious pizzas are being prepared with care.
                    </p>

                    {/* Order Details Card */}
                    <div className="order-details-card">
                        <div className="order-id-section">
                            <h3>📋 Your Order ID</h3>
                            <div className="order-id-display">
                                <span className="order-id-text">{orderId}</span>
                                <button 
                                    onClick={handleCopyOrderId}
                                    className="copy-btn"
                                    title="Copy Order ID"
                                >
                                    📋
                                </button>
                            </div>
                            <p className="order-id-note">
                                Save this ID to track your order
                            </p>
                        </div>

                        <div className="order-summary-section">
                            <div className="order-stat">
                                <span className="stat-icon">🍕</span>
                                <div className="stat-info">
                                    <span className="stat-number">{itemCount}</span>
                                    <span className="stat-label">Item{itemCount !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div className="order-stat">
                                <span className="stat-icon">⏱️</span>
                                <div className="stat-info">
                                    <span className="stat-number">25-30</span>
                                    <span className="stat-label">Minutes</span>
                                </div>
                            </div>
                            <div className="order-stat">
                                <span className="stat-icon">📍</span>
                                <div className="stat-info">
                                    <span className="stat-number">Preparing</span>
                                    <span className="stat-label">Status</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="success-actions">
                        <button 
                            onClick={handleTrackOrder}
                            className="success-btn primary"
                        >
                            <span>🔍</span>
                            Track My Order
                        </button>
                        
                        <button 
                            onClick={handleContinueShopping}
                            className="success-btn secondary"
                        >
                            <span>🍕</span>
                            Order More Pizzas
                        </button>
                    </div>
                </div>

                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="success-close-btn"
                    aria-label="Close modal"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default OrderSuccessModal;
