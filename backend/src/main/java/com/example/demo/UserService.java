package com.example.demo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RatingRepository ratingRepository;

    @Transactional
    public UserProfileDTO getUserProfile(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        user.calculateTrustScore();
        userRepository.save(user); // Save updated trust score

        return new UserProfileDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getTrustScore(),
            user.getTotalRatings(),
            user.getAverageRating(),
            user.getRecentPositiveRatings(),
            user.getReceivedRatings()
        );
    }

    @Transactional
    public void updateUserTrustScore(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.calculateTrustScore();
            userRepository.save(user);
        }
    }
} 