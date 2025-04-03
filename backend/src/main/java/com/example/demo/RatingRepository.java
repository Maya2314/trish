package com.example.demo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    // Find all ratings for a specific user with pagination
    @Query("SELECT r FROM Rating r WHERE r.ratedUserId = ?1")
    Page<Rating> findByRatedUserId(Long userId, Pageable pageable);
    
    // Find all ratings for a specific user (when pagination is not needed)
    @Query("SELECT r FROM Rating r WHERE r.ratedUserId = ?1 ORDER BY r.createdAt DESC")
    List<Rating> findByRatedUserId(Long userId);
    
    // Find all ratings given by a specific user with pagination
    @Query("SELECT r FROM Rating r WHERE r.raterId = ?1")
    Page<Rating> findByRaterId(Long userId, Pageable pageable);
    
    // Find rating for a specific transaction with eager loading
    @Query("SELECT r FROM Rating r WHERE r.transactionId = ?1")
    Rating findByTransactionId(Long transactionId);
    
    // Calculate average rating for a user (cached query)
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.ratedUserId = ?1")
    Double calculateAverageRating(Long userId);
    
    // Count total ratings for a user (cached query)
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.ratedUserId = ?1")
    Long countRatings(Long userId);
    
    // Get user rating statistics in a single query
    @Query("SELECT new com.example.demo.RatingStats(COUNT(r), AVG(r.ratingValue), " +
           "SUM(CASE WHEN r.ratingValue >= 4 THEN 1 ELSE 0 END)) " +
           "FROM Rating r WHERE r.ratedUserId = ?1")
    RatingStats getUserRatingStats(Long userId);
} 