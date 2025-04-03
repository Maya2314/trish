import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './Cart.css';

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="star half" />);
    } else {
      stars.push(<FaRegStar key={i} className="star empty" />);
    }
  }

  return (
    <div className="star-rating">
      {stars}
      <span className="rating-number">({rating})</span>
    </div>
  );
};

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const [quantityErrors, setQuantityErrors] = useState({});

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityUpdate = (item, newQuantity) => {
    if (newQuantity > item.availableQuantity) {
      setQuantityErrors({
        ...quantityErrors,
        [item.id]: `Only ${item.availableQuantity} units available from seller`
      });
      return;
    }

    setQuantityErrors({
      ...quantityErrors,
      [item.id]: null
    });
    updateQuantity(item.id, newQuantity);
  };

  if (!cartItems.length) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart to see them here!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.itemName}</h3>
              <p className="item-type">{item.foodType}</p>
              <div className="seller-info">
                <p><strong>Seller:</strong> {item.seller}</p>
                <StarRating rating={item.sellerRating || 5.0} />
              </div>
              <p><strong>Storage:</strong> {item.storageConditions}</p>
              <p><strong>Expires:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
              <span className={`condition ${item.condition ? item.condition.toLowerCase() : 'unknown'}`}>
                {item.condition || 'Unknown'}
              </span>
              <p className="available-quantity">
                <strong>Available:</strong> {item.availableQuantity} units
              </p>
            </div>
            <div className="item-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityUpdate(item, Math.max(0, item.quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                  className="quantity-btn"
                  disabled={item.quantity >= item.availableQuantity}
                >
                  +
                </button>
                {quantityErrors[item.id] && (
                  <p className="quantity-error">{quantityErrors[item.id]}</p>
                )}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="total">
          <h3>Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</h3>
        </div>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart; 