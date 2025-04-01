package com.andisoftwaresolutions.coupongenerator.dto;


import com.andisoftwaresolutions.coupongenerator.model.Coupon;
import com.andisoftwaresolutions.coupongenerator.model.CouponStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private Long id;
    private String code;
    private String description;
    private double discountAmount;
    private String expiryDate;
    private String createdAt;
    private String usedAt;
    private CouponStatus status;
    private String assignedTo;  // Stores user email or name instead of User entity

    public CouponDto(Coupon coupon) {
        this.id = coupon.getId();
        this.code = coupon.getCode();
        this.description = coupon.getDescription();
        this.discountAmount = coupon.getDiscountAmount();
        this.expiryDate = coupon.getExpiryDate();
        this.createdAt = coupon.getCreatedAt();
        this.usedAt = coupon.getUsedAt();
        this.status = coupon.getStatus();
        this.assignedTo = (coupon.getUser() != null) ? coupon.getUser().getEmail() : "Unassigned";
    }
}

