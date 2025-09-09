import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import DeliveryModal from './DeliveryModal';
import './App.css';

function Order() {
    const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle opening the delivery modal
    const handlePlaceOrder = () => {
        if (items.length === 0) {
            alert('Your cart is empty. Please add some items before placing an order.');
            return;
        }
        setShowDeliveryModal(true);
    };

    // Handle order submission from modal
    const handleOrderSubmit = async (orderData) => {
        setIsProcessing(true);

        try {
            // Call your /placeOrder API
            const response = await fetch('/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CustomerName: orderData.customerName,
                    Items: orderData.items,
                    DeliveryAddress: orderData.deliveryAddress
                })
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const result = await response.json();
            const orderId = result.OrderId;

            // Clear cart and navigate to tracking
            clearCart();
            setShowDeliveryModal(false);

            alert(`Order placed successfully! Your Order ID is: ${orderId}`);
            navigate('/tracking');

        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="home-container">
            {/* Delivery Modal - Appears on top of everything */}
            <DeliveryModal
                isOpen={showDeliveryModal}
                onClose={() => setShowDeliveryModal(false)}
                onSubmit={handleOrderSubmit}
                cartTotal={total}
                cartItems={items}
            />

            {/* Header */}
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
                    <h1>Your Order</h1>

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
                            {/* Cart Items Section */}
                            <div className="cart-section">
                                <h2>Your Items ({items.length} items)</h2>
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
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary">
                                <h2>Order Summary</h2>
                                <div className="summary-line">
                                    <span>Subtotal:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || items.length === 0}
                                    className="place-order-btn"
                                >
                                    Place Order - ${total.toFixed(2)}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Order;