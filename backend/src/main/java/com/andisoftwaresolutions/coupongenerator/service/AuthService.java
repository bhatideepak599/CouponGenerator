package com.andisoftwaresolutions.coupongenerator.service;

import com.andisoftwaresolutions.coupongenerator.dto.AuthRequest;
import com.andisoftwaresolutions.coupongenerator.dto.AuthResponse;
import com.andisoftwaresolutions.coupongenerator.dto.UserDto;
import com.andisoftwaresolutions.coupongenerator.model.Role;
import com.andisoftwaresolutions.coupongenerator.model.User;
import com.andisoftwaresolutions.coupongenerator.repository.UserRepository;
import com.andisoftwaresolutions.coupongenerator.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public void register(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        Role role= Role.ROLE_USER;
        if(userDto.getRole()=="ROLE_ADMIIN"){
            role=Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .name(userDto.getName())
                .email(userDto.getEmail())
                .mobile(userDto.getMobile())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(role)
                .approved(false)
                .enabled(true)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
