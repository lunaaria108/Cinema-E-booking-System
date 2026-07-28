package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.model.Promotion;
import com.csci.cinemabackend.service.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping
    public ResponseEntity<Promotion> createPromotion(
            @RequestBody Promotion promotion
    ) {
        Promotion savedPromotion =
                promotionService.createPromotion(promotion);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPromotion);
    }
}
