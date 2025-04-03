-- Insert sample users
INSERT INTO users (username, email, trust_score, total_ratings) VALUES
('john_doe', 'john@example.com', 0.0, 0),
('jane_smith', 'jane@example.com', 0.0, 0),
('bob_wilson', 'bob@example.com', 0.0, 0);

-- Insert sample orders
INSERT INTO orders (shop, customer_id, seller_id, item, order_date, order_status, price) VALUES
('Fresh Groceries', 1, 2, 'Organic Vegetables', NOW(), 'DELIVERED', 25.99),
('Organic Market', 2, 1, 'Fresh Fruits', NOW(), 'DELIVERED', 45.50),
('Local Bakery', 3, 2, 'Artisan Bread', NOW(), 'DELIVERED', 15.75),
('Farm Fresh', 1, 3, 'Farm Eggs', NOW(), 'PENDING', 30.00),
('Health Foods', 2, 1, 'Organic Milk', NOW(), 'SHIPPED', 55.25);

-- Insert sample ratings
INSERT INTO ratings (raterId, ratedUserId, ratingValue, comment, transactionId, createdAt, editableUntil) VALUES
(1, 2, 5, 'Excellent service and fresh products!', 1, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR)),
(2, 1, 4, 'Good quality items, fast delivery', 2, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR)),
(3, 2, 5, 'Best organic products in town', 3, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR)); 