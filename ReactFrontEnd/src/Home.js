import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useCart } from './CartContext';
import './App.css';

// Stock data for fallback when API fails
const stockFeaturedMenu = [
    {
        pizzaId: "1",
        pizzaName: "Margherita Classic",
        pizzaDescription: "Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil",
        ingredients: "Fresh Mozzarella, San Marzano Tomatoes, Fresh Basil, Extra Virgin Olive Oil",
        imageUrl: "/pizza1.png",
        smallPrice: 12.90,
        mediumPrice: 16.90,
        largePrice: 20.90
    },
    {
        pizzaId: "2",
        pizzaName: "Pepperoni Supreme",
        pizzaDescription: "Double pepperoni, mozzarella cheese, Italian herbs on a crispy base",
        ingredients: "Pepperoni, Mozzarella Cheese, Italian Herbs",
        imageUrl: "/pizza1.png",
        smallPrice: 14.90,
        mediumPrice: 18.90,
        largePrice: 22.90
    },
    {
        pizzaId: "3",
        pizzaName: "Veggie Garden",
        pizzaDescription: "Bell peppers, red onions, mushrooms, olives, fresh tomatoes",
        ingredients: "Bell Peppers, Red Onions, Mushrooms, Olives, Fresh Tomatoes",
        imageUrl: "/pizza1.png",
        smallPrice: 13.90,
        mediumPrice: 17.90,
        largePrice: 21.90
    }
];

export default function Home() {
    const [featuredPizzas, setFeaturedPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingStockData, setUsingStockData] = useState(false);
    
    // Toast notification state
    const [showToast, setShowToast] = useState(false);
    const [toastData, setToastData] = useState({ productName: '', size: '', price: 0 });
    
    const { addToCart, itemCount } = useCart();

    // Set page title
    useEffect(() => {
        document.title = "Pronto Pizzas - Authentic. Fresh. Fast.";
    }, []);

    // Function to get 3 random pizzas from array
    const getRandomPizzas = (pizzaArray, count = 3) => {
        const shuffled = [...pizzaArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Fetch pizzas from API
    const fetchFeaturedPizzas = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://localhost:7212/api/ProductsApi', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            // Transform API data to ensure it has the expected structure
            const transformedData = data.map(pizza => ({
                pizzaId: pizza.pizzaId,
                pizzaName: pizza.pizzaName,
                pizzaDescription: pizza.pizzaDescription,
                ingredients: pizza.ingredients,
                imageUrl: pizza.imageUrl || "/pizza1.png",
                smallPrice: pizza.smallPrice || 0,
                mediumPrice: pizza.mediumPrice || 0,
                largePrice: pizza.largePrice || 0
            }));

            // Get 3 random pizzas from API data
            const randomPizzas = getRandomPizzas(transformedData, 3);
            console.log(randomPizzas);
            setFeaturedPizzas(randomPizzas);
            setUsingStockData(false);

        } catch (error) {
            console.error('Error fetching products, using stock data:', error);
            
            // Use stock data as fallback
            const randomStockPizzas = getRandomPizzas(stockFeaturedMenu, 3);
            setFeaturedPizzas(randomStockPizzas);
            setUsingStockData(true);
        } finally {
            setLoading(false);
        }
    };

    // Load featured pizzas when component mounts
    useEffect(() => {
        fetchFeaturedPizzas();
    }, []);

    // Handle adding pizza to cart with toast notification
    const handleAddToCart = (pizzaId, pizzaName, size, price) => {
        const item = {
            pizzaId,
            pizzaName,
            size,
            price,
            quantity: 1,
            image: "/pizza1.png"
        };

        addToCart(item);

        // Show toast notification
        setToastData({ productName: pizzaName, size, price });
        setShowToast(true);

        // Auto-hide toast after 4 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    };

    // Close toast manually
    const closeToast = () => {
        setShowToast(false);
    };

    return (
        <div className="home-container">
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
                            <div className="toast-title">Added to Cart!</div>
                            <div className="toast-description">
                                {toastData.productName} ({toastData.size}) - ${toastData.price.toFixed(2)}
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
                        <Link to="/order">
                            Order {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                        </Link>
                        <Link to="/tracking">Tracking</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="main-hero">
                <section className="hero-content">
                    <h1>Freshly Hot cooked Pizzas</h1>
                    <p>Delicious pizzas made with the freshest ingredients, delivered pronto to your door.</p>
                    <Link to="/menu" className="order-btn">Order Now</Link>
                </section>
                <div className="pizza-img-wrapper">
                    <img src="/pizza1.png" alt="Pizza" className="pizza-img" />
                </div>
            </main>

            {/* Featured Menu Section */}
            <section className="featured-menu">
                <div className="curve-divider" aria-hidden="true">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,30 Q720,80 1440,30 L1440,80 L0,80 Z" />
                    </svg>
                </div>
                
                <h2>
                    Featured Menu
                    {usingStockData && <span style={{fontSize: '0.8em', color: '#666'}}> (Demo Mode)</span>}
                </h2>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading featured pizzas...</p>
                    </div>
                ) : (
                    <div className="menu-grid">
                        {featuredPizzas.map((pizza) => (
                            <div className="menu-card" key={pizza.pizzaId}>
                                <img src={pizza.imageUrl || "/pizza1.png"} alt={pizza.pizzaName} className="menu-img" />
                                <div className="menu-details">
                                    <h3>{pizza.pizzaName}</h3>
                                    <p>{pizza.pizzaDescription}</p>
                                    <p><strong>Ingredients:</strong> {pizza.ingredients}</p>
                                    <div className="menu-bottom">
                                        <div className="size-options">
                                            <button
                                                className="menu-order-btn"
                                                onClick={() => handleAddToCart(pizza.pizzaId, pizza.pizzaName, "Small", pizza.smallPrice)}
                                            >
                                                Add Small - ${pizza.smallPrice ? pizza.smallPrice.toFixed(2) : '0.00'}
                                            </button>
                                            <button
                                                className="menu-order-btn"
                                                onClick={() => handleAddToCart(pizza.pizzaId, pizza.pizzaName, "Medium", pizza.mediumPrice)}
                                            >
                                                Add Medium - ${pizza.mediumPrice ? pizza.mediumPrice.toFixed(2) : '0.00'}
                                            </button>
                                            <button
                                                className="menu-order-btn"
                                                onClick={() => handleAddToCart(pizza.pizzaId, pizza.pizzaName, "Large", pizza.largePrice)}
                                            >
                                                Add Large - ${pizza.largePrice ? pizza.largePrice.toFixed(2) : '0.00'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link to="/menu" className="order-btn">
                            View Full Menu
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
