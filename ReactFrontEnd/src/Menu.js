import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

/*Temporary data structure to simulate API response*/
const tempMenuData = [
    [
        1,
        "Margherita Classic",
        "Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil",
        [
            [1, "Small (10\")", 14.99],
            [2, "Medium (12\")", 18.99],
            [3, "Large (14\")", 22.99]
        ],
        "/pizza1.png"
    ],
    [
        2,
        "Pepperoni Supreme",
        "Premium pepperoni, mozzarella cheese, signature tomato sauce",
        [
            [4, "Small (10\")", 16.99],
            [5, "Medium (12\")", 20.99],
            [6, "Large (14\")", 24.99]
        ],
        "/pizza1.png"
    ],
    [
        3,
        "Veggie Deluxe",
        "Bell peppers, red onions, black olives, mushrooms, fresh spinach, mozzarella",
        [
            [7, "Small (10\")", 15.99],
            [8, "Medium (12\")", 19.99],
            [9, "Large (14\")", 23.99]
        ],
        "/pizza1.png"
    ],
    [
        4,
        "Meat Lovers",
        "Pepperoni, Italian sausage, ground beef, bacon, ham, mozzarella",
        [
            [10, "Small (10\")", 18.99],
            [11, "Medium (12\")", 22.99],
            [12, "Large (14\")", 26.99]
        ],
        "/pizza1.png"
    ],
    [
        5,
        "BBQ Chicken",
        "Grilled chicken, BBQ sauce, red onions, cilantro, smoked mozzarella",
        [
            [13, "Small (10\")", 17.99],
            [14, "Medium (12\")", 21.99],
            [15, "Large (14\")", 25.99]
        ],
        "/pizza1.png"
    ],
    [
        6,
        "Hawaiian Paradise",
        "Ham, pineapple, mozzarella cheese, signature tomato sauce",
        [
            [16, "Small (10\")", 16.99],
            [17, "Medium (12\")", 20.99],
            [18, "Large (14\")", 24.99]
        ],
        "/pizza1.png"
    ]
];

/* Menu Component - Displays the pizza menu with search and filtering capabilities */
export default function Menu() {
    // State management for component data
    const [products, setProducts] = useState([]); // Stores the menu products
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [selectedCategory, setSelectedCategory] = useState("All"); // Currently selected category filter
    const [searchTerm, setSearchTerm] = useState(""); // User's search input

    // Available categories for filtering
    const categories = ["All", "Classic", "Premium", "Vegetarian", "Meat Lovers"];

    /**
     * Effect hook to simulate API data fetching
     * Loads temporary menu data with a simulated delay
     * TODO: Replace with actual API call to /getProducts endpoint
     */
    useEffect(() => {
        // Simulate API delay (1 second)
        setTimeout(() => {
            setProducts(tempMenuData);
            setLoading(false);
        }, 1000);
    }, []); // Empty dependency array means this runs once on component mount

    /**
     * Filter products based on current search term and selected category
     * Searches through product names and descriptions (case-insensitive)
     * Applies category filtering based on product name keywords
     */
    const filteredProducts = products.filter(product => {
        // Check if product matches search term (searches name and description)
        const matchesSearch = product[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
            product[2].toLowerCase().includes(searchTerm.toLowerCase());

        // If "All" category is selected, only apply search filter
        if (selectedCategory === "All") return matchesSearch;

        // Apply category-specific filtering based on product name
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

    /**
     * Handle order button clicks
     * Currently logs order details to console
     * TODO: Implement actual order functionality with cart management and API calls
     * 
     * @param {number} productId - Unique product identifier
     * @param {number} variantId - Unique variant identifier (size/price combination)
     * @param {string} productName - Name of the pizza
     * @param {string} variantName - Size description (e.g., "Small (10\")")
     * @param {number} price - Price for this specific variant
     */
    const handleOrder = (productId, variantId, productName, variantName, price) => {
        console.log(`Order placed for: ${productName} (${variantName}) - $${price}`);
        // TODO: Implement actual order functionality:
        // - Add to cart
        // - Show confirmation
        // - Navigate to order page
        // - Make API call to /placeOrder endpoint
    };

    return (
        <div className="home-container">
            {/* Header section with logo and navigation */}
            <header className="home-header">
                <div className="header-left">
                    {/* Logo with tagline */}
                    <Link to="/" className="logo-link">
                        <div className="logo">
                            Pronto Pizzas
                            <span className="shop-tagline">Authentic. Fresh. Fast.</span>
                        </div>
                    </Link>
                    {/* Main navigation menu */}
                    <nav className="nav-links">
                        <Link to="/menu">Menu</Link>
                        <Link to="/order">Order</Link>
                        <Link to="/tracking">Tracking</Link>
                    </nav>
                </div>
            </header>

            {/* Hero section with search and filtering controls */}
            <main className="main-hero">
                <section className="hero-content">
                    <h1>Our Delicious Menu</h1>
                    <p>Handcrafted pizzas made with premium ingredients and traditional techniques.</p>

                    {/* Search functionality */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search pizzas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Category filter buttons */}
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
                
                {/* Hero image */}
                <div className="pizza-img-wrapper">
                    <img src="/pizza1.png" alt="Fresh Pizza" className="pizza-img" />
                </div>
            </main>

            {/* Menu display section */}
            <section className="featured-menu">
                {/* Decorative curved divider */}
                <div className="curve-divider" aria-hidden="true">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,30 Q720,80 1440,30 L1440,80 L0,80 Z" fill="#f6d581" />
                    </svg>
                </div>
                
                {/* Section header with item count */}
                <h2>
                    {selectedCategory === "All" ? "Complete Menu" : selectedCategory}
                    <span className="product-count">({filteredProducts.length} items)</span>
                </h2>

                {/* Conditional rendering based on loading state and results */}
                {loading ? (
                    // Loading spinner while data is being fetched
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading delicious pizzas...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    // No results found message with reset option
                    <div className="no-results">
                        <p>No pizzas found matching your criteria.</p>
                        <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="reset-btn">
                            Show All Pizzas
                        </button>
                    </div>
                ) : (
                    // Main menu grid display
                    <div className="menu-grid">
                        {filteredProducts.map(product => (
                            // Individual pizza card
                            <div className="menu-card" key={product[0]}>
                                {/* Pizza image */}
                                <img src={product[4]} alt={product[1]} className="menu-img" />
                                
                                {/* Pizza details */}
                                <div className="menu-details">
                                    {/* Pizza name */}
                                    <h3>{product[1]}</h3>
                                    {/* Pizza description */}
                                    <p className="menu-description">{product[2]}</p>

                                    {/* Size variants with pricing and order buttons */}
                                    {Array.isArray(product[3]) && product[3].length > 0 && (
                                        <div className="variants-container">
                                            <h4>Available Sizes:</h4>
                                            {product[3].map(variant => (
                                                // Individual size variant row
                                                <div key={variant[0]} className="variant-row">
                                                    {/* Size and price information */}
                                                    <div className="variant-info">
                                                        <span className="variant-size">{variant[1]}</span>
                                                        <span className="menu-price">${variant[2].toFixed(2)}</span>
                                                    </div>
                                                    {/* Order button for this specific size */}
                                                    <button 
                                                        className="menu-order-btn"
                                                        onClick={() => handleOrder(
                                                            product[0],  // productId
                                                            variant[0],  // variantId
                                                            product[1],  // productName
                                                            variant[1],  // variantName (size)
                                                            variant[2]   // price
                                                        )}
                                                    >
                                                        Order
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