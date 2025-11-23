package com.mytom.tom_learning_app.service;

import com.mytom.tom_learning_app.entity.User;
import com.mytom.tom_learning_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GameService {
    
    private final UserRepository userRepository;
    
    /**
     * 获取用户首页数据
     * 如果用户不存在，抛出异常（需要先注册）
     * @param userId 用户ID
     * @return 用户的钻石数
     */
    @Transactional
    public Map<String, Object> getHomeData(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在，请先注册"));
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("diamonds", user.getDiamondBalance());
        result.put("totalStudyMinutes", user.getTotalStudyMinutes());
        result.put("lastCheckIn", user.getLastCheckIn());
        
        return result;
    }
    
    /**
     * 增加用户钻石
     * @param userId 用户ID
     * @param amount 增加的钻石数量
     * @return 更新后的用户信息
     */
    @Transactional
    public Map<String, Object> addDiamonds(Long userId, int amount) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + userId));
        
        // 增加钻石
        user.setDiamondBalance(user.getDiamondBalance() + amount);
        user = userRepository.save(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("diamonds", user.getDiamondBalance());
        result.put("message", "成功增加 " + amount + " 钻石！");
        
        return result;
    }
    
    /**
     * 获取用户信息
     * @param userId 用户ID
     * @return 用户实体
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在，ID: " + userId));
    }
}

