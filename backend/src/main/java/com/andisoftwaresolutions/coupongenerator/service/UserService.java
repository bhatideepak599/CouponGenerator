package com.andisoftwaresolutions.coupongenerator.service;

import com.andisoftwaresolutions.coupongenerator.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAllUsers();

    User findById(Long userId);

    void approve(User user);
}
