package com.example.demo;

public class RatingStats {
    private Long totalRatings;
    private Double averageRating;
    private Long positiveRatings;

    public RatingStats(Long totalRatings, Double averageRating, Long positiveRatings) {
        this.totalRatings = totalRatings;
        this.averageRating = averageRating;
        this.positiveRatings = positiveRatings;
    }

    // Getters
    public Long getTotalRatings() {
        return totalRatings;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Long getPositiveRatings() {
        return positiveRatings;
    }

    // Setters
    public void setTotalRatings(Long totalRatings) {
        this.totalRatings = totalRatings;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public void setPositiveRatings(Long positiveRatings) {
        this.positiveRatings = positiveRatings;
    }
} 