import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.jpg';
import profile from '../assets/profile.jpg';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <img src={Logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <input type="text" placeholder="Search for items..." className="search-input" />
        </div>
      </div>

      <div className="nav-right">
        <Link to="/explore" className="nav-link">Explore</Link>
        <Link to="/messages" className="nav-link">Messages</Link>
        <Link to="/transactions" className="nav-link">Transactions</Link>
        <Link to="/foodbanks" className="nav-link">Food Banks</Link>
        <Link to="/cart" className="nav-link cart-link">
          Cart
          {cartCount > 0 && (
            <span className="cart-count" title={`${cartCount} items in cart`}>
              {cartCount}
            </span>
          )}
        </Link>
        <div className="profile-dropdown">
          <img
            src={profile}
            alt="Profile"
            className="profile-icon"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <Link to="/logout" className="dropdown-item">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 