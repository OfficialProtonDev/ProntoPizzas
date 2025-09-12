import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import './App.css';

function Tracking() {
    const [orderId, setOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);
    const location = useLocation();

    const trackOrder = async (orderIdToTrack) => {
        setIsLoading(true);
        setError('');

        try {
            // Call the OrdersApi GET endpoint with ID
            const response = await fetch(`https://localhost:7212/api/OrdersApi/${orderIdToTrack}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Order not found');
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log('Order data received:', data); // For debugging

            // Transform the API response to match our component's expectations
            const transformedData = {
                orderId: data.orderId,
                customerName: data.customerName,
                deliveryAddress: data.deliveryAddress,
                orderStatus: data.orderStatus,
                orderDate: data.orderDate,
                items: data.orderProducts || []
            };
            setOrderData(transformedData);
        }
        catch (error) {
            console.error('Error fetching order:', error);
            setError(`Order not found. Please check your Order ID and try again.`);
            setOrderData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Order Tracking - Pronto Pizzas";
        return () => {
            document.title = "Pronto Pizzas"; // Reset to default
        };
    }, []);

    // Check for order ID in URL parameters and auto-track
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlOrderId = searchParams.get('orderId');
        
        if (urlOrderId) {
            // Set the order ID in the input field
            setOrderId(urlOrderId);
            
            // Automatically track the order
            trackOrder(urlOrderId);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!orderId.trim()) {
            setError('Please enter a valid Order ID.');
            return;
        }
        
        // Validate GUID format
        const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!guidPattern.test(orderId.trim())) {
            setError('Please enter a valid Order ID format.');
            return;
        }
        
        trackOrder(orderId.trim());
    };

    const getStatusStep = (status) => {
        const statuses = ['preparing', 'baking', 'ready', 'delivering', 'delivered'];
        return statuses.indexOf(status?.toLowerCase()) + 1;
    };

    const getStatusDisplay = (status) => {
        const statusMap = {
            'preparing': 'Preparing your order',
            'baking': 'Baking in the oven',
            'ready': 'Ready for pickup/delivery',
            'delivering': 'Out for delivery',
            'delivered': 'Delivered'
        };
        return statusMap[status?.toLowerCase()] || status;
    };

    const getStatusIcon = (status, isActive, isCompleted) => {
        const iconMap = {
            'preparing': '👨‍🍳',
            'baking': '🔥',
            'ready': '✅',
            'delivering': '🚗',
            'delivered': '🏠'
        };
        
        if (isCompleted) return '✓';
        if (isActive) return iconMap[status] || '⏳';
        return '';
    };

    const formatOrderDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateOrderTotal = (items) => {
        // Since we don't have prices in the order items, we'll show item count instead
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-left">
                    <Link to="/" className="logo-link">
                        <img src="/pizza_logo_yellow.png" alt="Logo" className="logo-img" />
                        <div className="logo">
                            Pronto Pizzas
                            <span className="shop-tagline">Authentic. Fresh. Fast.</span>
                        </div>
                    </Link>
                    <nav className="nav-links">
                        <Link to="/menu">Menu</Link>
                        <Link to="/order">Order</Link>
                        <Link to="/tracking">Tracking</Link>
                    </nav>
                </div>
            </header>

            <main className="tracking-main">
                <div className="tracking-container">
                    <div className="tracking-header">
                        <h1>Track Your Order</h1>
                        <p>Enter your Order ID to see real-time updates on your pizza's journey</p>
                    </div>

                    {/* Order Lookup Form - Only show if no order data is displayed */}
                    {!orderData && (
                        <div className="tracking-lookup-card">
                            <div className="tracking-lookup-header">
                                <h2>🔍 Order Lookup</h2>
                                <p>Find your order using the Order ID provided when you placed your order</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="tracking-form">
                                <div className="tracking-input-group">
                                    <label htmlFor="orderId">Order ID</label>
                                    <input
                                        type="text"
                                        id="orderId"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="Enter your Order ID (e.g., 3fa85f64-5717-4562-b3fc-2c963f66afa6)"
                                        className={`tracking-input ${error ? 'error' : ''}`}
                                    />
                                    {error && <span className="tracking-error">{error}</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="tracking-submit-btn"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="tracking-spinner"></span>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <span>🔍</span>
                                            Track My Order
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && !orderData && (
                        <div className="tracking-loading">
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Loading your order details...</p>
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    {orderData && (
                        <div className="tracking-results">
                            {/* Order Status Card */}
                            <div className="tracking-status-card">
                                <div className="status-header">
                                    <h2>📦 Order Status</h2>
                                    <div className="status-badge">
                                        <span className="status-indicator"></span>
                                        {getStatusDisplay(orderData.orderStatus)}
                                    </div>
                                </div>

                                {/* Progress Timeline */}
                                <div className="tracking-timeline">
                                    {['preparing', 'baking', 'ready', 'delivering', 'delivered'].map((status, index) => {
                                        const currentStep = getStatusStep(orderData.orderStatus);
                                        const isCompleted = currentStep > index + 1;
                                        const isActive = currentStep === index + 1;
                                        
                                        return (
                                            <div
                                                key={status}
                                                className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                                            >
                                                <div className="timeline-indicator">
                                                    <div className="timeline-icon">
                                                        {getStatusIcon(status, isActive, isCompleted)}
                                                    </div>
                                                    {index < 4 && <div className="timeline-line"></div>}
                                                </div>
                                                <div className="timeline-content">
                                                    <h4>{getStatusDisplay(status)}</h4>
                                                    <p className="timeline-description">
                                                        {status === 'preparing' && 'Our chefs are carefully preparing your order'}
                                                        {status === 'baking' && 'Your pizza is baking to perfection in our wood-fired oven'}
                                                        {status === 'ready' && 'Your order is ready and being packaged'}
                                                        {status === 'delivering' && 'Your order is on its way to you'}
                                                        {status === 'delivered' && 'Your order has been delivered. Enjoy!'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Information Grid */}
                            <div className="tracking-info-grid">
                                {/* Customer Information */}
                                <div className="tracking-info-card">
                                    <div className="info-card-header">
                                        <h3>👤 Customer Information</h3>
                                    </div>
                                    <div className="info-card-content">
                                        <div className="info-row">
                                            <span className="info-label">Name:</span>
                                            <span className="info-value">{orderData.customerName || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Delivery Address:</span>
                                            <span className="info-value">{orderData.deliveryAddress || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Order Date:</span>
                                            <span className="info-value">{formatOrderDate(orderData.orderDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="tracking-info-card">
                                    <div className="info-card-header">
                                        <h3>📋 Order Details</h3>
                                    </div>
                                    <div className="info-card-content">
                                        <div className="info-row">
                                            <span className="info-label">Order ID:</span>
                                            <span className="info-value order-id">{orderData.orderId}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Total Items:</span>
                                            <span className="info-value">{calculateOrderTotal(orderData.items)} items</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Status:</span>
                                            <span className="info-value status-text">{orderData.orderStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="tracking-items-card">
                                <div className="items-header">
                                    <h3>🍕 Your Order Items</h3>
                                    <span className="items-count">{orderData.items.length} item(s)</span>
                                </div>
                                
                                {orderData.items.length > 0 ? (
                                    <div className="tracking-items-list">
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="tracking-item">
                                                <div className="item-icon">🍕</div>
                                                <div className="item-details">
                                                    <h4>{item.product?.pizzaName || 'Pizza'}</h4>
                                                    <div className="item-specs">
                                                        <span className="item-size">Size: {item.size}</span>
                                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                                    </div>
                                                    {item.product?.pizzaDescription && (
                                                        <p className="item-description">{item.product.pizzaDescription}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-items">
                                        <p>No items found for this order</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="tracking-actions">
                                <Link to="/menu" className="tracking-action-btn primary">
                                    🍕 Make another order
                                </Link>
                                <button 
                                    onClick={() => {
                                        setOrderData(null);
                                        setOrderId('');
                                        setError('');
                                        // Clear URL parameters
                                        window.history.replaceState({}, '', '/tracking');
                                    }}
                                    className="tracking-action-btn secondary"
                                >
                                    🔍 Track a different Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Tracking;
