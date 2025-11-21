package com.mytom.tom_learning_app.controller;

import com.mytom.tom_learning_app.entity.User;
import com.mytom.tom_learning_app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    // 🎯 新用户注册接口（支持指定ID）
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> request) {
        try {
            String username = (String) request.get("username");
            Long userId = request.containsKey("id") ? 
                Long.valueOf(request.get("id").toString()) : null;
            
            // 检查用户名是否已存在
            if (userService.existsByUsername(username)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "用户名已存在，请尝试登录！"));
            }
            
            // 创建新用户
            User user = userService.createUserWithId(userId, username);
            return ResponseEntity.ok(Map.of(
                "message", "注册成功！",
                "user", user
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    // 创建用户（旧接口，保留兼容性）
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            User user = userService.createUser(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 获取所有用户
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    // 获取用户详情
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable Long userId) {
        try {
            User user = userService.getUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 通过用户名获取用户
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 每日签到
    @PostMapping("/{userId}/checkin")
    public ResponseEntity<?> checkIn(@PathVariable Long userId) {
        try {
            User user = userService.checkIn(userId);
            return ResponseEntity.ok(Map.of(
                "message", "签到成功！获得10钻石",
                "user", user
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

