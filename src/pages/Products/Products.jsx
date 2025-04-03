import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTimes } from 'react-icons/fa';
import './Products.css';

const getConditionClass = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'fresh':
      return 'condition fresh';
    case 'imperfect':
      return 'condition imperfect';
    case 'near expiry':
      return 'condition near-expiry';
    default:
      return 'condition';
  }
};

const StarRating = ({ rating, onClick, interactive = false }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <FaStar 
          key={i} 
          className={`star filled ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onClick(i)}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <FaStarHalfAlt 
          key={i} 
          className={`star half ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onClick(i - 0.5)}
        />
      );
    } else {
      stars.push(
        <FaRegStar 
          key={i} 
          className={`star empty ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onClick(i)}
        />
      );
    }
  }

  return (
    <div className="star-rating">
      {stars}
      {!interactive && <span className="rating-number">({rating})</span>}
    </div>
  );
};

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>{product.itemName}</h2>
        
        <div className="modal-section">
          <h3>Seller Information</h3>
          <div className="seller-details">
            <p><strong>Seller:</strong> {product.seller}</p>
            <div className="seller-rating">
              <strong>Rating:</strong>
              <StarRating rating={product.sellerRating || 5.0} />
            </div>
          </div>
        </div>

        <div className="modal-section">
          <h3>Product Details</h3>
          <div className="product-specifications">
            <p><strong>Food Type:</strong> {product.foodType}</p>
            <p><strong>Condition:</strong> <span className={getConditionClass(product.condition)}>{product.condition}</span></p>
            <p><strong>Quantity Available:</strong> {product.quantity} units</p>
            <p><strong>Storage Required:</strong> {product.storageConditions}</p>
            <p><strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="modal-section">
          <h3>Storage Instructions</h3>
          <div className="storage-instructions">
            {product.storageConditions === 'Refrigerated' ? (
              <p>Keep refrigerated at 2-8°C (35-46°F). Do not freeze.</p>
            ) : (
              <p>Store in a cool, dry place at room temperature (20-25°C/68-77°F).</p>
            )}
          </div>
        </div>

        <div className="modal-section">
          <h3>Additional Information</h3>
          <div className="additional-info">
            <p>• Best consumed within {product.condition === 'Near Expiry' ? '1-2 days' : '1 week'} of purchase</p>
            <p>• Handle with care to maintain product quality</p>
            <p>• Contact seller for bulk purchases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [addedToCart, setAddedToCart] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    foodTypes: [],
    conditions: [],
    storageConditions: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:8080/swapsaviour/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please make sure the backend server is running.');
        setLoading(false);
      });
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      foodTypes: [],
      conditions: [],
      storageConditions: []
    });
    setSearchTerm('');
    setMinRating(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRatingFilter = (rating) => {
    setMinRating(rating === minRating ? 0 : rating);
  };

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    addToCart({ ...product, quantity: 1 });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000); // Reset after 2 seconds
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const filteredProducts = products.filter(product => {
    // Search term filter
    const searchMatch = searchTerm === '' || 
      product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filters
    const foodTypeMatch = filters.foodTypes.length === 0 || filters.foodTypes.includes(product.foodType);
    const conditionMatch = filters.conditions.length === 0 || filters.conditions.includes(product.condition);
    const storageMatch = filters.storageConditions.length === 0 || filters.storageConditions.includes(product.storageConditions);
    
    // Rating filter
    const ratingMatch = (product.sellerRating || 5.0) >= minRating;

    return searchMatch && foodTypeMatch && conditionMatch && storageMatch && ratingMatch;
  });

  // Get unique values for filter options
  const uniqueFoodTypes = [...new Set(products.map(p => p.foodType))];
  const uniqueConditions = [...new Set(products.map(p => p.condition))];
  const uniqueStorageConditions = [...new Set(products.map(p => p.storageConditions))];

  if (loading) {
    return <div className="loading-indicator">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-layout">
      <div className="filter-section">
        <h2>Filters</h2>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <h3>Minimum Rating</h3>
          <div className="rating-filter">
            <StarRating 
              rating={minRating} 
              onClick={handleRatingFilter}
              interactive={true}
            />
            {minRating > 0 && (
              <p className="selected-rating">
                {minRating}+ stars
              </p>
            )}
          </div>
        </div>
        
        <div className="filter-group">
          <h3>Food Type</h3>
          <div className="filter-options">
            {uniqueFoodTypes.map(type => (
              <div key={type} className="filter-option">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={filters.foodTypes.includes(type)}
                  onChange={() => handleFilterChange('foodTypes', type)}
                />
                <label htmlFor={`type-${type}`}>{type}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Condition</h3>
          <div className="filter-options">
            {uniqueConditions.map(condition => (
              <div key={condition} className="filter-option">
                <input
                  type="checkbox"
                  id={`condition-${condition}`}
                  checked={filters.conditions.includes(condition)}
                  onChange={() => handleFilterChange('conditions', condition)}
                />
                <label htmlFor={`condition-${condition}`}>{condition}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Storage</h3>
          <div className="filter-options">
            {uniqueStorageConditions.map(storage => (
              <div key={storage} className="filter-option">
                <input
                  type="checkbox"
                  id={`storage-${storage}`}
                  checked={filters.storageConditions.includes(storage)}
                  onChange={() => handleFilterChange('storageConditions', storage)}
                />
                <label htmlFor={`storage-${storage}`}>{storage}</label>
              </div>
            ))}
          </div>
        </div>

        <button className="clear-filters" onClick={clearFilters}>
          Clear All Filters
        </button>
      </div>

      <div className="products-container">
        {addedToCart && (
          <div className="add-to-cart-notification">
            Item added to cart successfully!
          </div>
        )}
        <div className="products-header">
          <h1>Available Products</h1>
          <p className="results-count">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.itemName}</h3>
                <p className="product-type">{product.foodType}</p>
                <div className="product-details">
                  <div className="seller-info">
                    <p><strong>Seller:</strong> {product.seller}</p>
                    <StarRating rating={product.sellerRating || 5.0} />
                  </div>
                  <p><strong>Quantity:</strong> {product.quantity} units</p>
                  <p><strong>Storage:</strong> {product.storageConditions}</p>
                  <p><strong>Expires:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
                  <span className={getConditionClass(product.condition)}>
                    {product.condition}
                  </span>
                </div>
                <div className="product-actions">
                  <button 
                    className="btn view-details"
                    onClick={() => handleViewDetails(product)}
                  >
                    View Details
                  </button>
                  <button 
                    className={`btn add-to-cart ${addedToCart === product.id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedToCart === product.id}
                  >
                    {addedToCart === product.id ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Products; 