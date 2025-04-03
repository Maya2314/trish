package com.example.demo;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long raterId; // ID of the user giving the rating

    @Column(nullable = false)
    private Long ratedUserId; // ID of the user being rated

    @Column(nullable = false)
    private Integer ratingValue; // Rating from 1 to 5

    @Column(length = 500)
    private String comment; // Optional comment about the rating

    @Column(nullable = false)
    private Long transactionId; // Reference to the transaction

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime editableUntil;

    // Default constructor
    public Rating() {
        this.createdAt = LocalDateTime.now();
        // Set editable until 24 hours after creation
        this.editableUntil = this.createdAt.plusHours(24);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRaterId() {
        return raterId;
    }

    public void setRaterId(Long raterId) {
        this.raterId = raterId;
    }

    public Long getRatedUserId() {
        return ratedUserId;
    }

    public void setRatedUserId(Long ratedUserId) {
        this.ratedUserId = ratedUserId;
    }

    public Integer getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getEditableUntil() {
        return editableUntil;
    }

    public void setEditableUntil(LocalDateTime editableUntil) {
        this.editableUntil = editableUntil;
    }

    public boolean isEditable() {
        return LocalDateTime.now().isBefore(editableUntil);
    }
} 