import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './App.css';

// temp data for display
const featuredMenu = [
    {
        name: "Margherita",
        description: "Fresh basil, mozzarella & tomato sauce",
        price: "$16",
        img: "/pizza1.png"
    },
    {
        name: "Pepperoni",
        description: "Double pepperoni & mozzarella",
        price: "$18",
        img: "/pizza1.png"
    },
    {
        name: "Veggie Supreme",
        description: "Peppers, onions, olives & mushrooms",
        price: "$17",
        img: "/pizza1.png"
    }
];
//nav bar
export default function Home() {
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
                        <a href="/menu">Menu</a>
                        <a href="/order">Order</a>
                        <a href="/tracking">Tracking</a>
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
                <h2>Featured Menu</h2>
                <div className="menu-grid">
                    {featuredMenu.map((item) => (
                        <div className="menu-card" key={item.name}>
                            <img src={item.img} alt={item.name} className="menu-img" />
                            <div className="menu-details">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="menu-bottom">
                                    <span className="menu-price">{item.price}</span>
                                    <button className="menu-order-btn">Order</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
