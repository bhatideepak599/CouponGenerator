package com.andisoftwaresolutions.coupongenerator.controller;

import com.andisoftwaresolutions.coupongenerator.model.Coupon;
import com.andisoftwaresolutions.coupongenerator.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CouponService couponService;

    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getUserCoupons(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(couponService.getUserCoupons(userEmail));
    }

    @PutMapping("/coupons/{id}/use")
    public ResponseEntity<String> useCoupon(
            @PathVariable Long id,
            Authentication authentication) {

        //System.out.println("===============================================================");
        String userEmail = authentication.getName();
        couponService.useCoupon(id, userEmail);
        return ResponseEntity.ok("Coupon used successfully");
    }
}
