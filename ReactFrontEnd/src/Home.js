import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useCart } from './CartContext';
import './App.css';

// Stock data for fallback when API fails
const stockFeaturedMenu = [
    [
        1,
        "Margherita Classic",
        "Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil",
        [
            [1, "Regular (23cm)", 18.90],
            [2, "Large (28cm)", 24.90],
            [3, "Family (33cm)", 29.90]
        ],
        "/pizza1.png"
    ],
    [
        2,
        "Pepperoni Supreme",
        "Double pepperoni, mozzarella cheese, Italian herbs on a crispy base",
        [
            [4, "Regular (23cm)", 20.90],
            [5, "Large (28cm)", 26.90],
            [6, "Family (33cm)", 31.90]
        ],
        "/pizza1.png"
    ],
    [
        3,
        "Veggie Garden",
        "Bell peppers, red onions, mushrooms, olives, fresh tomatoes",
        [
            [7, "Regular (23cm)", 19.90],
            [8, "Large (28cm)", 25.90],
            [9, "Family (33cm)", 30.90]
        ],
        "/pizza1.png"
    ],
    [
        4,
        "BBQ Chicken",
        "Grilled chicken, BBQ sauce, red onions, bell peppers, mozzarella",
        [
            [10, "Regular (23cm)", 22.90],
            [11, "Large (28cm)", 28.90],
            [12, "Family (33cm)", 33.90]
        ],
        "/pizza1.png"
    ],
    [
        5,
        "Meat Lovers",
        "Pepperoni, sausage, ham, bacon, ground beef, mozzarella cheese",
        [
            [13, "Regular (23cm)", 24.90],
            [14, "Large (28cm)", 30.90],
            [15, "Family (33cm)", 35.90]
        ],
        "/pizza1.png"
    ]
];

export default function Home() {
    const [featuredPizzas, setFeaturedPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingStockData, setUsingStockData] = useState(false);
    
    // Toast notification state
    const [showToast, setShowToast] = useState(false);
    const [toastData, setToastData] = useState({ productName: '', variantName: '', price: 0 });
    
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
            const response = await fetch('/getProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
                        
            const transformedProducts = data.map(product => [
                product.ProductId,
                product.Name,
                product.Description,
                product.Variants || [],
                product.ImageUrl
            ]);

            // Get 3 random pizzas from API data
            const randomPizzas = getRandomPizzas(transformedProducts, 3);
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
    const handleAddToCart = (productId, variantId, productName, variantName, price) => {
        const item = {
            productId,
            variantId,
            productName,
            variantName,
            price,
            image: "/pizza1.png"
        };

        addToCart(item);

        // Show toast notification
        setToastData({ productName, variantName, price });
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

    // Get the cheapest variant for display
    const getCheapestVariant = (variants) => {
        if (!variants || variants.length === 0) return { price: 0, name: "N/A" };
        
        const cheapest = variants.reduce((min, current) => 
            current[2] < min[2] ? current : min
        );
        
        return {
            id: cheapest[0],
            name: cheapest[1],
            price: cheapest[2]
        };
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
                                {toastData.productName} ({toastData.variantName}) - ${toastData.price.toFixed(2)}
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
                        {featuredPizzas.map((pizza) => {
                            const cheapestVariant = getCheapestVariant(pizza[3]);
                            
                            return (
                                <div className="menu-card" key={pizza[0]}>
                                    <img src={pizza[4]} alt={pizza[1]} className="menu-img" />
                                    <div className="menu-details">
                                        <h3>{pizza[1]}</h3>
                                        <p>{pizza[2]}</p>
                                        <div className="menu-bottom">
                                            <span className="menu-price">
                                                From ${cheapestVariant.price.toFixed(2)}
                                            </span>
                                            <button 
                                                className="menu-order-btn"
                                                onClick={() => handleAddToCart(
                                                    pizza[0],
                                                    cheapestVariant.id,
                                                    pizza[1],
                                                    cheapestVariant.name,
                                                    cheapestVariant.price
                                                )}
                                                disabled={!cheapestVariant.id}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
