package com.example.demo;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_listing")
public class ProductListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "product")
    private String product; 

    @Column(name = "item_name")
    private String itemName; 

    @Column(name = "seller")
    private String seller; 

    // New fields
    @Column(name = "food_type")
    private String foodType;  // e.g., "Fruits", "Vegetables"

    @Column(name = "quantity")
    private int quantity;  // Quantity available

    @Column(name = "expiry_date")
    private LocalDate expiryDate;  // Expiry date of the food

    @Column(name = "storage_conditions")
    private String storageConditions;  // e.g., "Refrigerated", "Room Temperature"

    @Column(name = "item_condition")
    private String itemCondition;  // e.g., "Fresh", "Imperfect", "Near Expiry"

    @Column(name = "seller_rating")
    private Double sellerRating;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getSeller() {
        return seller;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStorageConditions() {
        return storageConditions;
    }

    public void setStorageConditions(String storageConditions) {
        this.storageConditions = storageConditions;
    }

    public String getItemCondition() {
        return itemCondition;
    }

    public void setItemCondition(String itemCondition) {
        this.itemCondition = itemCondition;
    }

    public Double getSellerRating() {
        return sellerRating;
    }

    public void setSellerRating(Double sellerRating) {
        this.sellerRating = sellerRating;
    }

    @Override
    public String toString() {
        return "ProductListing{" +
                "id=" + id +
                ", product='" + product + '\'' +
                ", itemName='" + itemName + '\'' +
                ", seller='" + seller + '\'' +
                ", foodType='" + foodType + '\'' +
                ", quantity=" + quantity +
                ", expiryDate=" + expiryDate +
                ", storageConditions='" + storageConditions + '\'' +
                ", itemCondition='" + itemCondition + '\'' +
                ", sellerRating=" + sellerRating +
                '}';
    }
}
