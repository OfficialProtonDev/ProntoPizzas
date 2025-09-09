import React, { useState } from 'react';
import './App.css';

function DeliveryModal({ isOpen, onClose, onSubmit, cartTotal, cartItems }) {
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        specialInstructions: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};
        if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
        if (!customerInfo.city.trim()) newErrors.city = 'City is required';
        if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'Zip code is required';

        if (customerInfo.phone && !/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Prepare order data for API
            const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`;
            const deliveryAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.zipCode}`;
            const items = cartItems.map(item => ({
                ProductId: item.productId,
                VariantId: item.variantId,
                Quantity: item.quantity
            }));

            // Call the onSubmit function passed from parent
            await onSubmit({
                customerName,
                items,
                deliveryAddress,
                customerInfo // Include full customer info for reference
            });

        } catch (error) {
            console.error('Error submitting order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="delivery-modal-overlay">
            <div className="delivery-modal-container">
                {/* Close button */}
                <button className="delivery-modal-close" onClick={onClose} aria-label="Close modal">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Form section - now takes full width */}
                <div className="delivery-modal-form-section">
                    <h2 className="delivery-modal-title">Complete your order</h2>

                    <form onSubmit={handleSubmit} className="delivery-form">
                        {/* Name section */}
                        <div className="delivery-form-section">
                            <h3>Name</h3>
                            <div className="delivery-form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={customerInfo.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First Name *"
                                    className={`delivery-input ${errors.firstName ? 'error' : ''}`}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={customerInfo.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last Name *"
                                    className={`delivery-input ${errors.lastName ? 'error' : ''}`}
                                />
                            </div>
                            {(errors.firstName || errors.lastName) && (
                                <div className="delivery-error-messages">
                                    {errors.firstName && <span className="delivery-error">{errors.firstName}</span>}
                                    {errors.lastName && <span className="delivery-error">{errors.lastName}</span>}
                                </div>
                            )}
                        </div>

                        {/* Address section */}
                        <div className="delivery-form-section">
                            <h3>Address</h3>
                            <input
                                type="text"
                                name="address"
                                value={customerInfo.address}
                                onChange={handleInputChange}
                                placeholder="Street Address *"
                                className={`delivery-input full-width ${errors.address ? 'error' : ''}`}
                            />
                            <div className="delivery-form-row">
                                <input
                                    type="text"
                                    name="city"
                                    value={customerInfo.city}
                                    onChange={handleInputChange}
                                    placeholder="City *"
                                    className={`delivery-input ${errors.city ? 'error' : ''}`}
                                />
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={customerInfo.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="ZIP Code *"
                                    className={`delivery-input ${errors.zipCode ? 'error' : ''}`}
                                />
                            </div>
                            {(errors.address || errors.city || errors.zipCode) && (
                                <div className="delivery-error-messages">
                                    {errors.address && <span className="delivery-error">{errors.address}</span>}
                                    {errors.city && <span className="delivery-error">{errors.city}</span>}
                                    {errors.zipCode && <span className="delivery-error">{errors.zipCode}</span>}
                                </div>
                            )}
                        </div>

                        {/* Contact section */}
                        <div className="delivery-form-section">
                            <h3>Contact</h3>
                            <input
                                type="tel"
                                name="phone"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number *"
                                className={`delivery-input full-width ${errors.phone ? 'error' : ''}`}
                            />
                            {errors.phone && <span className="delivery-error">{errors.phone}</span>}
                        </div>

                        {/* Special instructions */}
                        <div className="delivery-form-section">
                            <h3>Special Instructions (Optional)</h3>
                            <textarea
                                name="specialInstructions"
                                value={customerInfo.specialInstructions}
                                onChange={handleInputChange}
                                placeholder="Any special delivery instructions..."
                                className="delivery-textarea"
                                rows={3}
                            />
                        </div>

                        {/* Order summary */}
                        <div className="delivery-order-summary">
                            <h3>Order Total: ${cartTotal.toFixed(2)}</h3>
                            <div className="delivery-items-count">
                                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your order
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="delivery-submit-btn"
                        >
                            {isSubmitting ? 'Placing Order...' : `Place Order - $${cartTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeliveryModal;