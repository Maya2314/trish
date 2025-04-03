import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from '../../Components/Rating';
import './Transactions.css';


// Separate DisputeForm component
const DisputeForm = ({ orders, onSubmit }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      orderId: selectedOrder.id,
      customerEmail: selectedOrder.customerEmail || 'customer@example.com',
      orderDetails: {
        item: selectedOrder.item,
        shop: selectedOrder.shop,
        totalPrice: selectedOrder.totalPrice,
        quantity: selectedOrder.quantity,
        orderDate: selectedOrder.orderDate,
        orderStatus: selectedOrder.orderStatus
      },
      reason: disputeReason,
      submittedAt: new Date().toISOString()
    });
    setDisputeSubmitted(true);
    setDisputeReason('');
    setSelectedOrder(null);
    
    setTimeout(() => {
      setDisputeSubmitted(false);
    }, 8000);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'status completed';
      case 'PENDING':
        return 'status pending';
      case 'SHIPPED':
        return 'status shipped';
      default:
        return 'status';
    }
  };

  if (disputeSubmitted) {
    return (
      <div className="dispute-container">
        <h2>File a Dispute</h2>
        <div className="success-message">
          <p><strong>Your dispute has been submitted successfully.</strong></p>
          <p>A confirmation email has been sent to your registered email address with all order details.</p>
          <p>Dispute reference: DSP-{Math.floor(Math.random() * 10000) + 1000}</p>
          <p>Our support team will review your dispute within 24-48 business hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dispute-container">
      <h2>File a Dispute</h2>
      <div className="order-selector">
        <label htmlFor="orderSelect">Select Order to Dispute:</label>
        <select 
          id="orderSelect"
          value={selectedOrder?.id || ''}
          onChange={(e) => {
            const orderId = e.target.value;
            const order = orders.find(o => o.id.toString() === orderId);
            setSelectedOrder(order || null);
          }}
        >
          <option value="">-- Select an order --</option>
          {orders.map(order => (
            <option key={order.id} value={order.id}>
              #{order.id} - {order.item} (£{order.totalPrice}) - {new Date(order.orderDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {selectedOrder && (
        <div className="order-details">
          <h3>Order Details</h3>
          <table className="details-table">
            <tbody>
              <tr>
                <td>Order ID:</td>
                <td>#{selectedOrder.id}</td>
              </tr>
              <tr>
                <td>Item:</td>
                <td>{selectedOrder.item}</td>
              </tr>
              <tr>
                <td>Shop:</td>
                <td>{selectedOrder.shop}</td>
              </tr>
              <tr>
                <td>Amount:</td>
                <td>£{selectedOrder.totalPrice}</td>
              </tr>
              <tr>
                <td>Quantity:</td>
                <td>{selectedOrder.quantity}</td>
              </tr>
              <tr>
                <td>Order Date:</td>
                <td>{new Date(selectedOrder.orderDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>
                  <span className={getStatusClass(selectedOrder.orderStatus)}>
                    {selectedOrder.orderStatus}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <form onSubmit={handleSubmit} className="dispute-form">
            <div className="form-group">
              <label htmlFor="disputeReason">Reason for Dispute:</label>
              <textarea
                id="disputeReason"
                rows="4"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                required
                placeholder="Please provide a detailed explanation of your dispute. Include any relevant order information or issues you experienced."
              />
            </div>
            <button type="submit" className="submit-button">Submit Dispute</button>
          </form>
        </div>
      )}
    </div>
  );
};

// RatingForm component
const RatingForm = ({ order, onSubmit }) => {
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleRatingSubmitted = (ratingData) => {
    onSubmit(ratingData);
    setRatingSubmitted(true);
    
    setTimeout(() => {
      setRatingSubmitted(false);
    }, 3000);
  };

  if (ratingSubmitted) {
    return (
      <div className="rating-container">
        <div className="success-message">
          <p><strong>Thank you for your rating!</strong></p>
          <p>Your feedback helps improve the community.</p>
        </div>
      </div>
    );
  }

  return (
    <Rating
      transactionId={order.id}
      raterId={order.customerId} // Assuming this exists in your order data
      ratedUserId={order.sellerId} // Assuming this exists in your order data
      onRatingSubmitted={handleRatingSubmitted}
    />
  );
};

// Main Transactions component
const Transactions = () => {
  const [activePage, setActivePage] = useState('View Receipts');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingFilters, setRatingFilters] = useState({
    minRating: '',
    maxRating: '',
    keyword: '',
    sort: 'newest'
  });

  useEffect(() => {
    fetchOrders();
    fetchRatings();
  }, [ratingFilters]); // Refetch when filters change

  const fetchOrders = () => {
    setLoading(true);
    axios.get('http://localhost:8080/swapsaviour/Checkout/orders')
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
        setLoading(false);
      });
  };

  const fetchRatings = () => {
    const params = new URLSearchParams();
    if (ratingFilters.minRating) params.append('minRating', ratingFilters.minRating);
    if (ratingFilters.maxRating) params.append('maxRating', ratingFilters.maxRating);
    if (ratingFilters.keyword) params.append('keyword', ratingFilters.keyword);
    if (ratingFilters.sort) params.append('sort', ratingFilters.sort);

    axios.get(`http://localhost:8080/swapsaviour/ratings/user/1?${params.toString()}`)
      .then((response) => {
        setRatings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching ratings:', error);
      });
  };

  const handleDisputeSubmit = (disputeReport) => {
    axios.post('http://localhost:8080/swapsaviour/disputes/submit', disputeReport)
      .then((response) => {
        console.log('Dispute submitted successfully', response.data);
      })
      .catch((error) => {
        console.error('Error submitting dispute:', error);
        setError('Failed to submit dispute. Please try again later.');
      });
  };

  const handleRatingSubmit = (ratingData) => {
    console.log('Rating submitted:', ratingData);
    // Refresh both orders and ratings lists
    fetchOrders();
    fetchRatings();
  };

  const handleEditRating = (ratingId, newData) => {
    axios.put(`http://localhost:8080/swapsaviour/ratings/${ratingId}`, newData)
      .then(() => {
        fetchRatings(); // Refresh ratings after edit
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('Failed to edit rating');
        }
      });
  };

  const handleDeleteRating = (ratingId) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      axios.delete(`http://localhost:8080/swapsaviour/ratings/${ratingId}`)
        .then(() => {
          fetchRatings(); // Refresh ratings after delete
        })
        .catch((error) => {
          if (error.response?.data?.error) {
            setError(error.response.data.error);
          } else {
            setError('Failed to delete rating');
          }
        });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'status completed';
      case 'PENDING':
        return 'status pending';
      case 'SHIPPED':
        return 'status shipped';
      default:
        return 'status';
    }
  };

  return (
    <div className="page-container">
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-nav">
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'View Receipts' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('View Receipts');
                  setSelectedOrder(null);
                }}
              >
                <i className="fas fa-receipt"></i>
                <span className="nav-text">View Receipts</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Dispute Order' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Dispute Order');
                  setSelectedOrder(null);
                }}
              >
                <i className="fas fa-exclamation-circle"></i>
                <span className="nav-text">Dispute Order</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Rate Order' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Rate Order');
                  setSelectedOrder(null);
                }}
              >
                <i className="fas fa-star"></i>
                <span className="nav-text">Rate Order</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>
            {activePage === 'View Receipts' ? 'Transaction History' : 
             activePage === 'Dispute Order' ? 'Order Dispute' : 
             'Rate Order'}
          </h1>
        </div>

        {loading && <div className="loading-indicator">Loading transactions...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && activePage === 'View Receipts' && (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Item</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.shop}</td>
                  <td>£{order.totalPrice}</td>
                  <td>{order.quantity}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <span className={getStatusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && activePage === 'Dispute Order' && (
          <DisputeForm orders={orders} onSubmit={handleDisputeSubmit} />
        )}

        {!loading && !error && activePage === 'Rate Order' && (
          <div className="rating-section">
            <div className="order-selector">
              <label htmlFor="orderSelect">Select Order to Rate:</label>
              <select 
                id="orderSelect"
                value={selectedOrder?.id || ''}
                onChange={(e) => {
                  const orderId = e.target.value;
                  const order = orders.find(o => o.id.toString() === orderId);
                  setSelectedOrder(order || null);
                }}
              >
                <option value="">-- Select an order --</option>
                {orders
                  .filter(order => order.orderStatus === 'DELIVERED')
                  .map(order => (
                    <option key={order.id} value={order.id}>
                      #{order.id} - {order.item} (£{order.totalPrice}) - {new Date(order.orderDate).toLocaleDateString()}
                    </option>
                  ))}
              </select>
            </div>

            {selectedOrder && (
              <RatingForm
                order={selectedOrder}
                onSubmit={handleRatingSubmit}
              />
            )}

            <div className="ratings-history">
              <div className="ratings-header">
                <h3>Your Ratings</h3>
                <div className="rating-filters">
                  <div className="filter-group">
                    <label>Filter by Rating:</label>
                    <select
                      value={ratingFilters.minRating}
                      onChange={(e) => setRatingFilters({
                        ...ratingFilters,
                        minRating: e.target.value
                      })}
                    >
                      <option value="">Min Rating</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <select
                      value={ratingFilters.maxRating}
                      onChange={(e) => setRatingFilters({
                        ...ratingFilters,
                        maxRating: e.target.value
                      })}
                    >
                      <option value="">Max Rating</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Search Comments:</label>
                    <input
                      type="text"
                      placeholder="Search by keyword..."
                      value={ratingFilters.keyword}
                      onChange={(e) => setRatingFilters({
                        ...ratingFilters,
                        keyword: e.target.value
                      })}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Sort By:</label>
                    <select
                      value={ratingFilters.sort}
                      onChange={(e) => setRatingFilters({
                        ...ratingFilters,
                        sort: e.target.value
                      })}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {ratings.length > 0 ? (
                <div className="ratings-list">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="rating-item">
                      <div className="rating-header">
                        <span className="rating-stars">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fas fa-star ${index < rating.ratingValue ? 'filled' : ''}`}
                            ></i>
                          ))}
                        </span>
                        <span className="rating-date">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="rating-comment">{rating.comment}</p>
                      )}
                      {new Date() < new Date(rating.editableUntil) && (
                        <div className="rating-actions">
                          <button
                            className="edit-button"
                            onClick={() => {
                              const newRating = prompt('Enter new rating (1-5):', rating.ratingValue);
                              const newComment = prompt('Enter new comment:', rating.comment);
                              if (newRating && !isNaN(newRating) && newRating >= 1 && newRating <= 5) {
                                handleEditRating(rating.id, {
                                  ...rating,
                                  ratingValue: parseInt(newRating),
                                  comment: newComment
                                });
                              }
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteRating(rating.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No ratings submitted yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transactions;