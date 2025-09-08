import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext'; 
import Home from './Home';
import Menu from './Menu';
import Order from './Order';
import Tracking from './Tracking';

function App() {
    return (
        <CartProvider>
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/tracking" element={<Tracking />} />
                </Routes>
            </div>
        </Router>
        </CartProvider>
    );
}

export default App;