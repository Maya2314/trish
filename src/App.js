import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './pages/Home/Home';
import Transactions from './pages/Transactions/Transaction';
import Products from './pages/Products/Products';
import Cart from './pages/Cart/Cart';
import FoodBanks from './pages/FoodBanks/FoodBanks';
import Profile from './pages/Profile/Profile';
import { CartProvider, useCart } from './context/CartContext.jsx';

const AppContent = () => {
  const { addToCart, cartItems, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/explore" element={<Products addToCart={addToCart} />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route 
          path="/cart" 
          element={
            <Cart 
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          } 
        />
        <Route path="/foodbanks" element={<FoodBanks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
