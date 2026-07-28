package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.model.Promotion;
import com.csci.cinemabackend.service.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    /*
     * Create a new promotion.
     * POST /api/admin/promotions
     */
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

    /*
     * Get every promotion.
     * GET /api/admin/promotions
     */
    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        List<Promotion> promotions =
                promotionService.getAllPromotions();

        return ResponseEntity.ok(promotions);
    }

    /*
     * Get one promotion by its ID.
     * GET /api/admin/promotions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(
            @PathVariable Long id
    ) {
        Promotion promotion =
                promotionService.getPromotionById(id);

        return ResponseEntity.ok(promotion);
    }

    /*
     * Update an existing promotion.
     * PUT /api/admin/promotions/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(
            @PathVariable Long id,
            @RequestBody Promotion promotion
    ) {
        Promotion updatedPromotion =
                promotionService.updatePromotion(id, promotion);

        return ResponseEntity.ok(updatedPromotion);
    }

    /*
     * Activate or deactivate a promotion.
     * PUT /api/admin/promotions/{id}/toggle
     */
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Promotion> togglePromotion(
            @PathVariable Long id
    ) {
        Promotion updatedPromotion =
                promotionService.togglePromotion(id);

        return ResponseEntity.ok(updatedPromotion);
    }

    /*
     * Delete a promotion.
     * DELETE /api/admin/promotions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(
            @PathVariable Long id
    ) {
        promotionService.deletePromotion(id);

        return ResponseEntity.noContent().build();
    }
}
