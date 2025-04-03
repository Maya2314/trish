package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FoodBankRepository extends JpaRepository<FoodBank, Long> {
    
    @Query(value = """
        SELECT *, 
        (6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(:lng)) + 
        sin(radians(:lat)) * sin(radians(latitude)))) AS distance 
        FROM food_bank 
        HAVING distance < 20 
        ORDER BY distance
        LIMIT 20
        """, nativeQuery = true)
    List<FoodBank> findNearbyFoodBanks(@Param("lat") double lat, @Param("lng") double lng);
} 