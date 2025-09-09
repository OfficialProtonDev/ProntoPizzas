import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import "./App.css";

export default function Menu() {
    // State for menu data and UI
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Toast notification state
    const [showToast, setShowToast] = useState(false);
    const [toastData, setToastData] = useState({ productName: '', size: '', price: 0 });

    const { addToCart, itemCount } = useCart();
    const categories = ["All", "Classic", "Premium", "Vegetarian", "Meat Lovers"];

    useEffect(() => {
        document.title = " Menu - Pronto Pizzas";
        return () => {
            document.title = "Pronto Pizzas "; // Reset to default
        };
    }, []);

    // API call to get products
    const fetchProducts = async () => {
        setLoading(true);
        setError('');

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
            const transformedProducts = data.map(pizza => ({
                pizzaId: pizza.pizzaId,
                pizzaName: pizza.pizzaName,
                pizzaDescription: pizza.pizzaDescription,
                ingredients: pizza.ingredients,
                imageUrl: pizza.imageUrl || "/pizza1.png",
                smallPrice: pizza.smallPrice || 0,
                mediumPrice: pizza.mediumPrice || 0,
                largePrice: pizza.largePrice || 0
            }));

            setProducts(transformedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load menu. Please try again later.');

            // use temp data on error 
            setProducts([
                {
                    pizzaId: "1",
                    pizzaName: "Margherita Classic",
                    pizzaDescription: "Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil",
                    ingredients: "Fresh Mozzarella, San Marzano Tomatoes, Fresh Basil, Extra Virgin Olive Oil",
                    imageUrl: "/pizza1.png",
                    smallPrice: 12.90,
                    mediumPrice: 16.90,
                    largePrice: 20.90
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Load menu data when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products by search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.pizzaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.pizzaDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.ingredients && product.ingredients.toLowerCase().includes(searchTerm.toLowerCase()));

        if (selectedCategory === "All") return matchesSearch;

        const productName = product.pizzaName.toLowerCase();
        switch (selectedCategory) {
            case "Classic":
                return matchesSearch && (productName.includes("margherita") || productName.includes("pepperoni"));
            case "Premium":
                return matchesSearch && (productName.includes("bbq") || productName.includes("supreme"));
            case "Vegetarian":
                return matchesSearch && productName.includes("veggie");
            case "Meat Lovers":
                return matchesSearch && (productName.includes("meat") || productName.includes("lovers"));
            default:
                return matchesSearch;
        }
    });

    // Add item to cart and show toast notification
    const handleOrder = (pizzaId, pizzaName, size, price) => {
        const item = {
            pizzaId,
            pizzaName,
            size,
            price: price || 0,
            quantity: 1,
            image: "/pizza1.png"
        };

        addToCart(item);

        // Show toast notification
        setToastData({ productName: pizzaName, size, price: price || 0 });
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

    // Retry loading products
    const retryFetch = () => {
        fetchProducts();
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
                    <h1>Our Delicious Menu</h1>
                    <p>Handcrafted pizzas made with premium ingredients and traditional techniques.</p>

                    {/* Search Bar */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search pizzas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="category-filter">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="pizza-img-wrapper">
                    <img src="/pizza1.png" alt="Fresh Pizza" className="pizza-img" />
                </div>
            </main>

            {/* Menu Grid */}
            <section className="featured-menu">
                <div className="curve-divider" aria-hidden="true">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,30 Q720,80 1440,30 L1440,80 L0,80 Z" fill="#f6d581" />
                    </svg>
                </div>

                <h2>
                    {selectedCategory === "All" ? "Complete Menu" : selectedCategory}
                    <span className="product-count">({filteredProducts.length} items)</span>
                </h2>

                {/* Error State */}
                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={retryFetch} className="retry-btn">
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading delicious pizzas...</p>
                    </div>
                ) : filteredProducts.length === 0 && !error ? (
                    <div className="no-results">
                        <p>No pizzas found matching your criteria.</p>
                        <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="reset-btn">
                            Show All Pizzas
                        </button>
                    </div>
                ) : (
                    <div className="menu-grid">
                        {filteredProducts.map(product => (
                            <div className="menu-card" key={product.pizzaId}>
                                <img src={product.imageUrl} alt={product.pizzaName} className="menu-img" />

                                <div className="menu-details">
                                    <h3>{product.pizzaName}</h3>
                                    <p className="menu-description">{product.pizzaDescription}</p>
                                    {product.ingredients && <p><strong>Ingredients:</strong> {product.ingredients}</p>}

                                    <div className="menu-bottom">
                                        <div className="size-options">
                                            <button
                                                className="menu-order-btn"
                                                onClick={() => handleOrder(product.pizzaId, product.pizzaName, "Small", product.smallPrice)}
                                            >
                                                Add Small - ${product.smallPrice ? product.smallPrice.toFixed(2) : '0.00'}
                                            </button>
                                            <button
                                                className="menu-order-btn"
                                                onClick={() => handleOrder(product.pizzaId, product.pizzaName, "Medium", product.mediumPrice)}
                                            >
                                                Add Medium - ${product.mediumPrice ? product.mediumPrice.toFixed(2) : '0.00'}
                                            </button>
                                            <button
                                                className="menu-order-btn"
                                                onClick={() => handleOrder(product.pizzaId, product.pizzaName, "Large", product.largePrice)}
                                            >
                                                Add Large - ${product.largePrice ? product.largePrice.toFixed(2) : '0.00'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}