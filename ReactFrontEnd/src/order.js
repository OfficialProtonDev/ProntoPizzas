import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './App.css';

function Order() {
    const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    // Customer information state
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        specialInstructions: ''
    });

    // Order processing state
    const [isProcessing, setIsProcessing] = useState(false); // to prevent multiple submissions
    const [errors, setErrors] = useState([]);

    //handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    // validate customer info
    const validateForm = () => {
        const newErrors = {};
        if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
        if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
        if (!customerInfo.city.trim()) newErrors.city = 'City is required';
        if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'Zip code is required';

        if (customerInfo.email && !/\S+@\S+\.\S+/.test(customerInfo.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (customerInfo.phone && !/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {

            newErrors.phone = 'Phone number is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle order submission
    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (items.length === 0) {
            alert('Your cart is empty. Please add some items before placing an order.');
            return;
        }

        setIsProcessing(true);

        // Simulate API call delay
        // TODO: Replace with actual API
        try {
            // Create order object 
            const orderData = {
                customerId: null, 
                customerInfo,
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    productName: item.productName,
                    variantName: item.variantName,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity
                })),
                subtotal: total,
                gst: total * 0.15, // 
                total: total * 1.15,
                orderDate: new Date().toISOString(),
                status: 'pending',
                estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000).toISOString() // time from now pizza estimated ready
            };

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Order submitted:', orderData);

            // Clear the cart
            clearCart();

            // Show success message
            alert(`Order placed successfully! Your order total is $${(total * 1.15).toFixed(2)}. You will receive a confirmation email shortly.`);

            // Navigate to tracking page 
            navigate('/tracking');

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Calculate gst and final total
    const gst = total * 0.15;
    const finalTotal = total + gst;

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="header-left">
                    <Link to="/" className="logo-link">
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
                    <h1>Complete Your Order</h1>

                    {/* Cart is empty state */}
                    {items.length === 0 ? (
                        <div className="empty-cart">
                            <h2>Your cart is empty</h2>
                            <p>Add some delicious pizzas to get started!</p>
                            <Link to="/menu" className="continue-shopping-btn">
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        <div className="order-content">
                            {/* Left side - Cart Items and Customer Info */}
                            <div className="order-left">
                                {/* Cart Items Section */}
                                <section className="cart-section">
                                    <h2>Your Order ({items.length} items)</h2>
                                    <div className="cart-items">
                                        {items.map((item) => (
                                            <div key={`${item.productId}-${item.variantId}`} className="cart-item">
                                                <img src={item.image} alt={item.productName} className="cart-item-image" />
                                                <div className="cart-item-details">
                                                    <h3>{item.productName}</h3>
                                                    <p className="cart-item-variant">{item.variantName}</p>
                                                    <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                                                </div>
                                                <div className="cart-item-controls">
                                                    <div className="quantity-controls">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                                                            className="quantity-btn"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="quantity">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                                            className="quantity-btn"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId, item.variantId)}
                                                        className="remove-btn"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Link to="/menu" className="continue-shopping">
                                        + Add more items
                                    </Link>
                                </section>

                                {/* Customer Information Form */}
                                <section className="customer-info-section">
                                    <h2>Delivery Information</h2>
                                    <form onSubmit={handleSubmitOrder} className="customer-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="firstName">First Name *</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={customerInfo.firstName}
                                                    onChange={handleInputChange}
                                                    className={errors.firstName ? 'error' : ''}
                                                />
                                                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="lastName">Last Name *</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={customerInfo.lastName}
                                                    onChange={handleInputChange}
                                                    className={errors.lastName ? 'error' : ''}
                                                />
                                                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={customerInfo.email}
                                                    onChange={handleInputChange}
                                                    className={errors.email ? 'error' : ''}
                                                />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={customerInfo.phone}
                                                    onChange={handleInputChange}
                                                    className={errors.phone ? 'error' : ''}
                                                    placeholder="(555) 123-4567"
                                                />
                                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address">Street Address *</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={customerInfo.address}
                                                onChange={handleInputChange}
                                                className={errors.address ? 'error' : ''}
                                                placeholder="123 Main Street"
                                            />
                                            {errors.address && <span className="error-message">{errors.address}</span>}
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="city">City *</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={customerInfo.city}
                                                    onChange={handleInputChange}
                                                    className={errors.city ? 'error' : ''}
                                                />
                                                {errors.city && <span className="error-message">{errors.city}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="zipCode">ZIP Code *</label>
                                                <input
                                                    type="text"
                                                    id="zipCode"
                                                    name="zipCode"
                                                    value={customerInfo.zipCode}
                                                    onChange={handleInputChange}
                                                    className={errors.zipCode ? 'error' : ''}
                                                    placeholder="12345"
                                                />
                                                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                                            <textarea
                                                id="specialInstructions"
                                                name="specialInstructions"
                                                value={customerInfo.specialInstructions}
                                                onChange={handleInputChange}
                                                rows={3}
                                                placeholder="Any special delivery instructions or preferences..."
                                            />
                                        </div>
                                    </form>
                                </section>
                            </div>

                            {/* Right side - Order Summary */}
                            <div className="order-right">
                                <section className="order-summary">
                                    <h2>Order Summary</h2>

                                    <div className="summary-line">
                                        <span>Subtotal:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>

                                    <div className="summary-line">
                                        <span>GST (15%):</span>
                                        <span>${gst.toFixed(2)}</span>
                                    </div>

                                    <div className="summary-line total">
                                        <span>Total:</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>

                                    <div className="delivery-info">
                                        <h3>Delivery Details</h3>
                                        <p><strong>Estimated Time:</strong> 30-40 minutes</p>
                                        <p><strong>Delivery Fee:</strong> Free (minimum $15 order)</p>
                                    </div>

                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={isProcessing || items.length === 0}
                                        className="place-order-btn"
                                    >
                                        {isProcessing ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
                                    </button>

                                    <p className="order-note">
                                        By placing this order, you agree to our terms and conditions.
                                        You will receive an email confirmation shortly.
                                    </p>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Order;