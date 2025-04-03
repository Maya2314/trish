package com.example.demo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
@RequestMapping("/swapsaviour/ratings")
@CrossOrigin(origins = "http://localhost:3000")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) {
        // Validate rating value
        if (rating.getRatingValue() < 1 || rating.getRatingValue() > 5) {
            return ResponseEntity.badRequest().build();
        }
        
        Rating savedRating = ratingRepository.save(rating);
        return ResponseEntity.ok(savedRating);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getUserRatings(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        
        List<Rating> ratings = ratingRepository.findByRatedUserId(userId);
        
        // Apply filters
        if (minRating != null) {
            ratings = ratings.stream()
                .filter(r -> r.getRatingValue() >= minRating)
                .collect(Collectors.toList());
        }
        
        if (maxRating != null) {
            ratings = ratings.stream()
                .filter(r -> r.getRatingValue() <= maxRating)
                .collect(Collectors.toList());
        }
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            String lowercaseKeyword = keyword.toLowerCase();
            ratings = ratings.stream()
                .filter(r -> r.getComment() != null && 
                           r.getComment().toLowerCase().contains(lowercaseKeyword))
                .collect(Collectors.toList());
        }
        
        // Apply sorting
        switch (sort) {
            case "oldest":
                ratings.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
                break;
            case "highest":
                ratings.sort((a, b) -> b.getRatingValue().compareTo(a.getRatingValue()));
                break;
            case "lowest":
                ratings.sort((a, b) -> a.getRatingValue().compareTo(b.getRatingValue()));
                break;
            default: // "newest"
                ratings.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        }
        
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserRatingStats(@PathVariable Long userId) {
        Double averageRating = ratingRepository.calculateAverageRating(userId);
        Long totalRatings = ratingRepository.countRatings(userId);
        
        Map<String, Object> stats = Map.of(
            "averageRating", averageRating != null ? averageRating : 0.0,
            "totalRatings", totalRatings
        );
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Rating> getTransactionRating(@PathVariable Long transactionId) {
        Rating rating = ratingRepository.findByTransactionId(transactionId);
        return rating != null ? ResponseEntity.ok(rating) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRating(@PathVariable Long id, @RequestBody Rating ratingDetails) {
        return ratingRepository.findById(id)
            .map(rating -> {
                if (LocalDateTime.now().isAfter(rating.getEditableUntil())) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Rating can no longer be edited"));
                }
                
                rating.setRatingValue(ratingDetails.getRatingValue());
                rating.setComment(ratingDetails.getComment());
                return ResponseEntity.ok(ratingRepository.save(rating));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id) {
        return ratingRepository.findById(id)
            .map(rating -> {
                if (LocalDateTime.now().isAfter(rating.getEditableUntil())) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Rating can no longer be deleted"));
                }
                
                ratingRepository.delete(rating);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
} 