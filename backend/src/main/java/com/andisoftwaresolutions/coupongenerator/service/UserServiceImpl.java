package com.andisoftwaresolutions.coupongenerator.service;

import com.andisoftwaresolutions.coupongenerator.model.Role;
import com.andisoftwaresolutions.coupongenerator.model.User;
import com.andisoftwaresolutions.coupongenerator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl  implements UserService{

    @Autowired
    private UserRepository userRepository;
    @Override
    public List<User> findAllUsers() {
        List<User> users=userRepository.findAll();

        return users.stream()
                .filter(user -> user.getRole().equals(Role.ROLE_USER))
                .collect(Collectors.toList());

    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId).get();
    }

    @Override
    public void approve(User user) {
        userRepository.save(user);
    }
}
