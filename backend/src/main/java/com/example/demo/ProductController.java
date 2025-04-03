package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/swapsaviour/products")
@CrossOrigin(origins = "http://localhost:3000")  // Allow requests from React frontend
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<ProductListing> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public ProductListing createProduct(@RequestBody ProductListing product) {
        return productRepository.save(product);
    }
} 