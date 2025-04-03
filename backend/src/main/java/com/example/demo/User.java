package com.example.demo;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(name = "trust_score")
    private Double trustScore = 0.0;

    @Column(name = "total_ratings")
    private Integer totalRatings = 0;

    @OneToMany(mappedBy = "ratedUserId", fetch = FetchType.LAZY)
    private List<Rating> receivedRatings = new ArrayList<>();

    // Calculated fields
    @Transient
    private Double averageRating;
    
    @Transient
    private Integer recentPositiveRatings;

    public void calculateTrustScore() {
        if (receivedRatings == null || receivedRatings.isEmpty()) {
            this.trustScore = 0.0;
            this.totalRatings = 0;
            return;
        }

        // Calculate average rating
        double sum = 0;
        int count = 0;
        int positiveRatings = 0;
        
        for (Rating rating : receivedRatings) {
            sum += rating.getRatingValue();
            count++;
            if (rating.getRatingValue() >= 4) {
                positiveRatings++;
            }
        }

        this.averageRating = sum / count;
        this.totalRatings = count;
        this.recentPositiveRatings = positiveRatings;

        // Trust score formula: 
        // (averageRating * 0.6) + (positiveRatingsPercentage * 0.3) + (totalRatingsWeight * 0.1)
        double positiveRatingsPercentage = (double) positiveRatings / count * 5; // Scale to 5
        double totalRatingsWeight = Math.min(count / 10.0, 5.0); // Cap at 5, scales up to 50 ratings

        this.trustScore = (averageRating * 0.6) + 
                         (positiveRatingsPercentage * 0.3) + 
                         (totalRatingsWeight * 0.1);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getTrustScore() {
        return trustScore;
    }

    public void setTrustScore(Double trustScore) {
        this.trustScore = trustScore;
    }

    public Integer getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }

    public List<Rating> getReceivedRatings() {
        return receivedRatings;
    }

    public void setReceivedRatings(List<Rating> receivedRatings) {
        this.receivedRatings = receivedRatings;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Integer getRecentPositiveRatings() {
        return recentPositiveRatings;
    }
} 