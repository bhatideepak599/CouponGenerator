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

    @PostMapping("/coupons/{code}/use")
    public ResponseEntity<String> useCoupon(
            @PathVariable String code,
            Authentication authentication) {
        String userEmail = authentication.getName();
        couponService.useCoupon(code, userEmail);
        return ResponseEntity.ok("Coupon used successfully");
    }
}
