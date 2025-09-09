import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './App.css';

function Tracking() {
    const [orderId, setOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [orderData, setOrderData] = useState(null);

    const trackOrder = async (orderIdToTrack) => {
        setIsLoading(true);
        setError('');

        try {
            // Call your /trackOrder API
            const response = await fetch('/trackOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ OrderId: orderIdToTrack })
            });

            if (!response.ok) {
                throw new Error('Order not found');
            }

            const data = await response.json();

            const transformedData = {
                orderId: orderIdToTrack,
                customerName: data.CustomerName,
                deliveryAddress: data.DeliveryAddress,
                orderStatus: data.OrderStatus,
                items: data.Items || []
            };
            setOrderData(transformedData);
        }
        catch (error) {
            setError('Order not found. Please check your Order ID and try again.');
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
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!orderId.trim()) {
            setError('Please enter a valid Order ID.');
            return;
        }
        trackOrder(orderId.trim());
    };

    const getStatusStep = (status) => {
        const statuses = ['ordered', 'preparing', 'baking', 'ready', 'delivering', 'delivered'];
        return statuses.indexOf(status.toLowerCase()) + 1;
    };

    const getStatusDisplay = (status) => {
        const statusMap = {
            'ordered': 'Order Placed',
            'preparing': 'Preparing your order',
            'baking': 'Baking in the oven',
            'ready': 'Ready for pickup/delivery',
            'delivering': 'Out for delivery',
            'delivered': 'Delivered'
        };
        return statusMap[status.toLowerCase()] || status;
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
            <main className="order-main">
                <div className="order-container">
                    <h1>Track Your Order</h1>

                    {/* Order Lookup Form */}
                    <div className="tracking-lookup">
                        <h2>Enter your Order ID</h2>
                        <form onSubmit={handleSubmit} className="lookup-form">
                            <div className="form-group">
                                <label htmlFor="orderId">Order ID:</label>
                                <input
                                    type="text"
                                    id="orderId"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g., ORD-123456"
                                    className={error ? 'error' : ''}
                                />
                                {error && <span className="error-message">{error}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="track-btn"
                            >
                                {isLoading ? 'Searching...' : 'Track Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Details */}
                    {orderData && (
                        <div className="order-details">
                            <h2>Order Details</h2>

                            {/* Order Status Progress */}
                            <div className="status-progress">
                                <h3>Order Status: {getStatusDisplay(orderData.orderStatus)}</h3>
                                <div className="progress-bar">
                                    {['ordered', 'preparing', 'baking', 'ready', 'delivering', 'delivered'].map((status, index) => (
                                        <div
                                            key={status}
                                            className={`progress-step ${getStatusStep(orderData.orderStatus) > index ? 'completed' : ''
                                                } ${getStatusStep(orderData.orderStatus) === index + 1 ? 'current' : ''
                                                }`}
                                        >
                                            <div className="step-circle">{index + 1}</div>
                                            <div className="step-label">{getStatusDisplay(status)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="order-info">
                                <div className="info-section">
                                    <h3>Customer Information</h3>
                                    <p><strong>Name:</strong> {orderData.customerName}</p>
                                    <p><strong>Delivery Address:</strong> {orderData.deliveryAddress}</p>
                                    <p><strong>Order ID:</strong> {orderData.orderId}</p>
                                </div>

                                {/* Order Items */}
                                <div className="info-section">
                                    <h3>Order Items</h3>
                                    {orderData.items.length > 0 ? (
                                        <div className="order-items">
                                            {orderData.items.map((item, index) => (
                                                <div key={index} className="order-item">
                                                    <span>Product ID: {item.ProductId}</span>
                                                    <span>Variant ID: {item.VariantId}</span>
                                                    <span>Quantity: {item.Quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No items found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Tracking;