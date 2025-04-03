package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/swapsaviour/foodbanks")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodBankController {

    @Autowired
    private FoodBankRepository foodBankRepository;

    @GetMapping
    public ResponseEntity<List<FoodBank>> getNearbyFoodBanks(
            @RequestParam("lat") double lat,
            @RequestParam("lng") double lng) {
        List<FoodBank> foodBanks = foodBankRepository.findNearbyFoodBanks(lat, lng);
        return ResponseEntity.ok(foodBanks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodBank> getFoodBankById(@PathVariable Long id) {
        return foodBankRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FoodBank> createFoodBank(@RequestBody FoodBank foodBank) {
        FoodBank savedFoodBank = foodBankRepository.save(foodBank);
        return ResponseEntity.ok(savedFoodBank);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodBank> updateFoodBank(
            @PathVariable Long id,
            @RequestBody FoodBank foodBankDetails) {
        return foodBankRepository.findById(id)
                .map(foodBank -> {
                    foodBank.setName(foodBankDetails.getName());
                    foodBank.setAddress(foodBankDetails.getAddress());
                    foodBank.setLatitude(foodBankDetails.getLatitude());
                    foodBank.setLongitude(foodBankDetails.getLongitude());
                    foodBank.setOpeningHours(foodBankDetails.getOpeningHours());
                    foodBank.setPhone(foodBankDetails.getPhone());
                    foodBank.setAcceptedItems(foodBankDetails.getAcceptedItems());
                    foodBank.setWebsiteUrl(foodBankDetails.getWebsiteUrl());
                    return ResponseEntity.ok(foodBankRepository.save(foodBank));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodBank(@PathVariable Long id) {
        return foodBankRepository.findById(id)
                .map(foodBank -> {
                    foodBankRepository.delete(foodBank);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 