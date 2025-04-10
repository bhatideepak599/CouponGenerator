package com.andisoftwaresolutions.coupongenerator.controller;

import com.andisoftwaresolutions.coupongenerator.dto.CouponDto;
import com.andisoftwaresolutions.coupongenerator.model.Coupon;
import com.andisoftwaresolutions.coupongenerator.model.User;
import com.andisoftwaresolutions.coupongenerator.service.CouponService;
import com.andisoftwaresolutions.coupongenerator.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final CouponService couponService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<String> approveUser(@PathVariable Long userId) {
        User user = userService.findById(userId);
        
        user.setApproved(true);
        userService.approve(user);
        return ResponseEntity.ok("User approved successfully");
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> generateCoupon(
            @RequestParam String description,
            @RequestParam double discountAmount,
            @RequestParam String expiryDate,
            @RequestParam int count) {
        return ResponseEntity.ok(couponService.generateCoupon(description, discountAmount, expiryDate,count));
    }

    @PostMapping("/coupons/{couponId}/assign")
    public ResponseEntity<String> assignCoupon(
            @PathVariable Long couponId,
            @RequestParam String userEmail) {
        couponService.assignCouponToUser(couponId, userEmail);
        return ResponseEntity.ok("Coupon assigned successfully");
    }

    @GetMapping("/coupons/un-assigned")
    public ResponseEntity<List<Coupon>> getUnassignedCoupons() {
        List<Coupon> coupons=couponService.getUnassignedCoupons();
        return ResponseEntity.ok(coupons);
    }
    @GetMapping("/coupons/assigned")
    public ResponseEntity<List<CouponDto>> assignedCoupons() {
        List<CouponDto> coupons=couponService.getassignedCoupons();
        return ResponseEntity.ok(coupons);
    }
}
