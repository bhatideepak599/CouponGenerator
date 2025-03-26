package com.andisoftwaresolutions.coupongenerator.service;

import com.andisoftwaresolutions.coupongenerator.model.Coupon;
import com.andisoftwaresolutions.coupongenerator.model.CouponStatus;
import com.andisoftwaresolutions.coupongenerator.repository.CouponRepository;
import com.andisoftwaresolutions.coupongenerator.repository.UserRepository;
import com.andisoftwaresolutions.coupongenerator.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private static final String COUPON_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    private static final int COUPON_LENGTH = 10;

    @Transactional
    public Coupon generateCoupon(String description, double discountAmount, String expiryDate) {
        String code = generateUniqueCouponCode();
        
        Coupon coupon = Coupon.builder()
                .code(code)
                .description(description)
                .discountAmount(discountAmount)
                .expiryDate(expiryDate)
                .status(CouponStatus.ACTIVE)
                .build();


        return couponRepository.save(coupon);
    }

    @Transactional
    public void assignCouponToUser(Long couponId, String userEmail) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isApproved()) {
            throw new RuntimeException("User is not approved");
        }

        coupon.setUser(user);
        couponRepository.save(coupon);
    }

    @Transactional
    public void useCoupon(String couponCode, String userEmail) {
        
        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new RuntimeException("Coupon is not active");
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm");

        // Convert expiryDate and current time to String
        String expiryDateString = coupon.getExpiryDate().format(String.valueOf(formatter));
        String currentDateString = LocalDateTime.now().format(formatter);

        // Compare as Strings
        if (expiryDateString.compareTo(currentDateString) < 0) {
            throw new RuntimeException("Coupon has expired");
        }

        if (!coupon.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Coupon is not assigned to this user");
        }

        coupon.setStatus(CouponStatus.USED);
        coupon.setUsedAt(LocalDateTime.now().toString());
        couponRepository.save(coupon);
    }

    public List<Coupon> getUserCoupons(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return couponRepository.findByUser(user);
    }
    private static final String SPECIAL_CHARS = "!@#$%^&*";

    private String generateUniqueCouponCode() {

        SecureRandom random = new SecureRandom();
        StringBuilder code;
        do {
            code = new StringBuilder();
            boolean hasSpecialChar = false;

            for (int i = 0; i < COUPON_LENGTH; i++) {
                char randomChar = COUPON_CHARS.charAt(random.nextInt(COUPON_CHARS.length()));
                if (SPECIAL_CHARS.indexOf(randomChar) >= 0) {
                    hasSpecialChar = true;
                }
                code.append(randomChar);
            }

            // Ensure at least one special character
            if (!hasSpecialChar) {
                int randomIndex = random.nextInt(COUPON_LENGTH);
                char specialChar = SPECIAL_CHARS.charAt(random.nextInt(SPECIAL_CHARS.length()));
                code.setCharAt(randomIndex, specialChar);
            }

        } while (couponRepository.existsByCode(code.toString()));

        return code.toString();
    }

}
