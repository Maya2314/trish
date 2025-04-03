package com.example.demo;

import java.util.List;

public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private Double trustScore;
    private Integer totalRatings;
    private Double averageRating;
    private Integer recentPositiveRatings;
    private List<Rating> ratings;

    public UserProfileDTO(Long id, String username, String email, Double trustScore, 
                        Integer totalRatings, Double averageRating, 
                        Integer recentPositiveRatings, List<Rating> ratings) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.trustScore = trustScore;
        this.totalRatings = totalRatings;
        this.averageRating = averageRating;
        this.recentPositiveRatings = recentPositiveRatings;
        this.ratings = ratings;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Double getTrustScore() {
        return trustScore;
    }

    public Integer getTotalRatings() {
        return totalRatings;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Integer getRecentPositiveRatings() {
        return recentPositiveRatings;
    }

    public List<Rating> getRatings() {
        return ratings;
    }
} 