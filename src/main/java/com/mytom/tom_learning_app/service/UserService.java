package com.mytom.tom_learning_app.service;

import com.mytom.tom_learning_app.entity.User;
import com.mytom.tom_learning_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserService {
    
    private final UserRepository userRepository;
    
    // 创建用户
    @Transactional
    public User createUser(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("用户名已存在");
        }
        User user = new User();
        user.setUsername(username);
        user.setDiamondBalance(50); // 初始赠送50钻石
        return userRepository.save(user);
    }
    
    // 获取用户
    public User getUser(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
    
    // 通过用户名获取用户
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
    
    // 获取所有用户
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // 每日签到
    @Transactional
    public User checkIn(Long userId) {
        User user = getUser(userId);
        LocalDate today = LocalDate.now();
        
        if (user.getLastCheckIn() != null && user.getLastCheckIn().equals(today)) {
            throw new RuntimeException("今天已经签到过了");
        }
        
        user.setLastCheckIn(today);
        user.setDiamondBalance(user.getDiamondBalance() + 10); // 签到奖励10钻石
        return userRepository.save(user);
    }
    
    // 增加钻石
    @Transactional
    public User addDiamonds(Long userId, Integer amount) {
        User user = getUser(userId);
        user.setDiamondBalance(user.getDiamondBalance() + amount);
        return userRepository.save(user);
    }
    
    // 减少钻石
    @Transactional
    public User deductDiamonds(Long userId, Integer amount) {
        User user = getUser(userId);
        if (user.getDiamondBalance() < amount) {
            throw new RuntimeException("钻石不足");
        }
        user.setDiamondBalance(user.getDiamondBalance() - amount);
        return userRepository.save(user);
    }
}

