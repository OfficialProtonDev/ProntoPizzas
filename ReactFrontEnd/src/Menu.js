import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import "./App.css";

// Temporary pizza data 
const tempMenuData = [
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
        "Premium pepperoni, mozzarella cheese, signature tomato sauce",
        [
            [4, "Regular (23cm)", 21.90],
            [5, "Large (28cm)", 27.90],
            [6, "Family (33cm)", 32.90]
        ],
        "/pizza1.png"
    ],
    [
        3,
        "Veggie Deluxe",
        "Bell peppers, red onions, black olives, mushrooms, fresh spinach, mozzarella",
        [
            [7, "Regular (23cm)", 20.90],
            [8, "Large (28cm)", 26.90],
            [9, "Family (33cm)", 31.90]
        ],
        "/pizza1.png"
    ],
    [
        4,
        "Meat Lovers",
        "Pepperoni, Italian sausage, ground beef, bacon, ham, mozzarella",
        [
            [10, "Regular (23cm)", 24.90],
            [11, "Large (28cm)", 30.90],
            [12, "Family (33cm)", 35.90]
        ],
        "/pizza1.png"
    ],
    [
        5,
        "BBQ Chicken",
        "Grilled chicken, BBQ sauce, red onions, cilantro, smoked mozzarella",
        [
            [13, "Regular (23cm)", 23.90],
            [14, "Large (28cm)", 29.90],
            [15, "Family (33cm)", 34.90]
        ],
        "/pizza1.png"
    ],
    [
        6,
        "Hawaiian Paradise",
        "Ham, pineapple, mozzarella cheese, signature tomato sauce",
        [
            [16, "Regular (23cm)", 22.90],
            [17, "Large (28cm)", 28.90],
            [18, "Family (33cm)", 33.90]
        ],
        "/pizza1.png"
    ]
];

export default function Menu() {
    // State for menu data and UI
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Toast notification state
    const [showToast, setShowToast] = useState(false);
    const [toastData, setToastData] = useState({ productName: '', variantName: '', price: 0 });

    const { addToCart, itemCount } = useCart();
    const categories = ["All", "Classic", "Premium", "Vegetarian", "Meat Lovers"];

    // Load menu data when component mounts
    useEffect(() => {
        setTimeout(() => {
            setProducts(tempMenuData);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter products by search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
            product[2].toLowerCase().includes(searchTerm.toLowerCase());

        if (selectedCategory === "All") return matchesSearch;

        const productName = product[1].toLowerCase();
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
    const handleOrder = (productId, variantId, productName, variantName, price) => {
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

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading delicious pizzas...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-results">
                        <p>No pizzas found matching your criteria.</p>
                        <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="reset-btn">
                            Show All Pizzas
                        </button>
                    </div>
                ) : (
                    <div className="menu-grid">
                        {filteredProducts.map(product => (
                            <div className="menu-card" key={product[0]}>
                                <img src={product[4]} alt={product[1]} className="menu-img" />

                                <div className="menu-details">
                                    <h3>{product[1]}</h3>
                                    <p className="menu-description">{product[2]}</p>

                                    {Array.isArray(product[3]) && product[3].length > 0 && (
                                        <div className="variants-container">
                                            <h4>Available Sizes:</h4>
                                            {product[3].map(variant => (
                                                <div key={variant[0]} className="variant-row">
                                                    <div className="variant-info">
                                                        <span className="variant-size">{variant[1]}</span>
                                                        <span className="menu-price">${variant[2].toFixed(2)}</span>
                                                    </div>
                                                    <button
                                                        className="menu-order-btn"
                                                        onClick={() => handleOrder(
                                                            product[0],
                                                            variant[0],
                                                            product[1],
                                                            variant[1],
                                                            variant[2]
                                                        )}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}