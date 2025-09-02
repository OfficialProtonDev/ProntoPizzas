import React from 'react';
import './App.css'; 

export default function Home() {
    return (
        // Header section with navigation links
        <div className="home-container">
            <header className="home-header">
                <div className="logo">Pronto Pizzas</div>
                <nav>
                    <a href="/menu" >Menu</a>
                    <a href="/order" >Order</a>
                    <a href="/login" >Login</a>
                    <a href="/signup" >Sign Up</a>
                </nav>
            </header>
            {/* Main section with promotional content */}
            <main>
                <h1>Freshly Hot cooked Pizzas</h1>
                <p>Delicious pizzas made with the freshest ingredients, delivered pronto to your door.</p>
                <button className="order-btn" >Order Now</button>
                <img src="/pizza1.png" alt="Pizza" className="pizza-img" />
            </main>
        </div>
    );
}