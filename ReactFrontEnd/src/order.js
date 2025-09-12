import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import DeliveryModal from './DeliveryModal';
import OrderSuccessModal from './OrderSuccessModal';
import './App.css';

function Order() {
    useEffect(() => {
        document.title = "Your Order - Pronto Pizzas";
        return () => {
            document.title = "Pronto Pizzas"; // Reset to default
        };
    }, []);
    const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccessData, setOrderSuccessData] = useState(null);

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
            // Generate a new order ID
            const orderId = crypto.randomUUID();

            // Transform cart items to match API expectations
            const orderProducts = items.map(item => ({
                orderId: orderId,
                pizzaId: item.pizzaId,
                size: item.size,
                quantity: item.quantity
            }));

            // Prepare order object for API 
            const orderPayload = {
                orderId: orderId,
                orderDate: new Date().toISOString(),
                customerName: orderData.customerName,
                deliveryAddress: orderData.deliveryAddress,
                orderStatus: "Preparing",
                orderProducts: orderProducts
            };

            console.log('Sending order payload:', orderPayload);

            // Call the OrdersApi POST endpoint
            const response = await fetch('https://localhost:7212/api/OrdersApi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to place order: ${response.status}`);
            }

            const result = await response.json();
            const responseOrderId = result.orderId || orderId;

            // Calculate total item count
            const itemCount = items.reduce((total, item) => total + item.quantity, 0);

            // Store success data
            setOrderSuccessData({
                orderId: responseOrderId,
                customerName: orderData.customerName,
                itemCount: itemCount
            });

            // Clear cart and close delivery modal
            clearCart();
            setShowDeliveryModal(false);

            // Show success modal
            setShowSuccessModal(true);

        } catch (error) {
            console.error('Error placing order:', error);
            alert(`There was an error placing your order: ${error.message}. Please try again.`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle closing success modal
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setOrderSuccessData(null);
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

            {/* Order Success Modal */}
            <OrderSuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                orderId={orderSuccessData?.orderId}
                customerName={orderSuccessData?.customerName}
                itemCount={orderSuccessData?.itemCount}
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
                                        <div key={`${item.pizzaId}-${item.size}`} className="cart-item">
                                            <img src={item.image || "/pizza1.png"} alt={item.pizzaName} className="cart-item-image" />
                                            <div className="cart-item-details">
                                                <h3>{item.pizzaName}</h3>
                                                <p className="cart-item-variant">{item.size}</p>
                                                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                                            </div>
                                            <div className="cart-item-controls">
                                                <div className="quantity-controls">
                                                    <button
                                                        onClick={() => updateQuantity(item.pizzaId, item.size, item.quantity - 1)}
                                                        className="quantity-btn"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.pizzaId, item.size, item.quantity + 1)}
                                                        className="quantity-btn"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.pizzaId, item.size)}
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
                                    {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
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